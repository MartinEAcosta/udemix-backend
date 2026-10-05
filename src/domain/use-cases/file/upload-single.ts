import { FileRepository } from "../../repository/file-repository";
import { CustomError } from "../../errors/custom-error";
import { UploadFileDto } from "../../dtos/file/file.dto";
import { FileResponseDto } from "../../dtos/file/file-response.dto";
import { AuthRepository, CourseRepository, LessonRepository } from "../../repository";
import { Folders } from "../../entities/file.entity";

export interface UploadFileUseCase {
    execute( files : UploadFileDto , folder : Folders , id_entity : string , id_user : string , role : string ) : Promise<FileResponseDto>;
}

export class UploadSingle implements UploadFileUseCase {

    constructor(
        private readonly fileRepository : FileRepository,
        private readonly courseRepository : CourseRepository,
        private readonly lessonRepository : LessonRepository,
        private readonly authRepository : AuthRepository,
    ) { }

    execute = async( file : UploadFileDto , folder : Folders , id_entity : string , id_user : string , role : string ): Promise<FileResponseDto> =>  {
        const searchedEntity = await this.obtainSearchedEntity( folder , id_entity );
        if(!searchedEntity) throw CustomError.notFound('No puede actualizarse una entidad que no existe.');

        await this.assertOwnership( folder , searchedEntity , id_entity , id_user , role );

        // Transaction
        if( searchedEntity.id_file ) {
            const fileToDelete = await this.fileRepository.deleteFile( searchedEntity.id_file )
            if( !fileToDelete ) throw CustomError.internalServer('Hubo un error al intentar borrar la antigua referencia.');
        }

        const newFile = await this.fileRepository.uploadFile( file , folder );
        if( !newFile ){
            throw CustomError.badRequest('Hubo un error al subir el archivo: ' + file );
        }

        const updatedReference = await this.assignNewIdFile( folder , id_entity , newFile ); 
        if( !updatedReference ) throw CustomError.internalServer('Hubo un error al actualizar la nueva referencia.');
        
        return {
            ...newFile,
        };        
    }

    private readonly strategies = {
        course : {
            find : async( id : string ) => {
                return await this.courseRepository.findCourseById(id);
            },
            update : async( id : string , newFile : FileResponseDto ) => {
                return await this.courseRepository.updateCourse(
                    {
                     id , id_file : newFile.id , thumbnail_url : newFile.url

                });
            },
        },
        lesson : {
            find : async( id : string ) => {
                return await this.lessonRepository.findLessonById(id);
            },
            update : async( id : string , newFile : FileResponseDto ) => {
                return await this.lessonRepository.updateLesson(
                    {
                        id,
                        id_file : newFile.id,
                    });
            },
        },
        user: {
            find : async( id : string ) => {
                return await this.authRepository.findUserById(id);
            },
            update : async( id : string , newFile : FileResponseDto ) => {
                return await this.authRepository.updateUser(
                    {
                        id,
                        avatar_url : newFile.url,
                        id_file : newFile.id,
                    });
            }
        }
    }

    obtainSearchedEntity = async( folder : Folders , id_entity : string ) => {
        let entity = this.strategies[folder];
        return await entity.find(id_entity);
    }

    assertOwnership = async( folder : Folders , searchedEntity : any , id_entity : string , id_user : string , role : string ) => {
        if( role === 'admin' ) return;

        if( folder === 'user' ) {
            if( id_entity !== id_user ) throw CustomError.unauthorized('No puedes modificar el archivo de otro usuario.');
            return;
        }

        if( folder === 'course' ) {
            if( searchedEntity.id_owner != id_user ) throw CustomError.unauthorized('No puedes modificar el archivo de un curso que no te pertenece.');
            return;
        }

        if( folder === 'lesson' ) {
            const course = await this.courseRepository.findCourseById( searchedEntity.id_course );
            if( !course ) throw CustomError.notFound('El curso al que pertenece la lección no existe.');
            if( course.id_owner != id_user ) throw CustomError.unauthorized('No puedes modificar el archivo de una lección de un curso que no te pertenece.');
            return;
        }
    }

    assignNewIdFile = async( folder : Folders , id_entity : string , file : FileResponseDto ) => {
        let entityToUpdate = this.strategies[folder];
        return await entityToUpdate.update(id_entity , file);
    }
    
}