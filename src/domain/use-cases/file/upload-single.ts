import { FileRepository } from "../../repository/file-repository";
import { CustomError } from "../../errors/custom-error";
import { UploadFileDto } from "../../dtos/file-upload/file-upload.dto";
import { FileResponseDto } from "../../dtos/file-upload/file-upload.response.dto";
import { CourseRepository, LessonRepository } from "../../repository";

export interface UploadFileUseCase {
    execute( files : UploadFileDto , folder : 'courses' | 'lessons' , id_entity : string) : Promise<FileResponseDto>;
}

export class UploadSingle implements UploadFileUseCase {

    constructor(
        private readonly fileRepository : FileRepository,
        private readonly courseRepository : CourseRepository,
        private readonly lessonRepository : LessonRepository,
    ) { }
    
    execute = async( file : UploadFileDto , folder : 'courses' | 'lessons'  , id_entity : string ): Promise<FileResponseDto> =>  {
        const searchedEntity = await this.obtainSearchedEntity( folder , id_entity );
        if(!searchedEntity) throw CustomError.notFound('No puede actualizarse una entidad que no existe.');

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
        courses : {
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
        lessons : {
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
    }

    obtainSearchedEntity = async( folder : 'courses' | 'lessons' , id_entity : string ) => {
        let entity = this.strategies[folder];
        return await entity.find(id_entity);        
    }

    assignNewIdFile = async( folder : 'courses' | 'lessons' , id_entity : string , file : FileResponseDto ) => {
        let entityToUpdate = this.strategies[folder];
        return await entityToUpdate.update(id_entity , file);
    }
    
}