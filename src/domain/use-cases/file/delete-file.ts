import { FileRepository } from '../../repository/file-repository';
import { AuthRepository, CourseRepository, LessonRepository } from '../../repository';
import { CustomError } from '../../errors/custom-error';
import { Folders } from '../../entities/file.entity';

interface DeleteFileUseCase {
    execute ( folder : Folders , id_entity : string , id_user : string , role : string ) : Promise<boolean>;
}

export class DeleteFile implements DeleteFileUseCase {

    constructor(
        private readonly fileRepository : FileRepository,
        private readonly courseRepository : CourseRepository,
        private readonly lessonRepository : LessonRepository,
        private readonly authRepository : AuthRepository,
    ) { }

    private readonly strategies = {
        course : async( id : string ) => await this.courseRepository.findCourseById( id ),
        lesson : async( id : string ) => await this.lessonRepository.findLessonById( id ),
        user   : async( id : string ) => await this.authRepository.findUserById( id ),
    }

    async execute( folder : Folders , id_entity : string , id_user : string , role : string ): Promise<boolean> {
        const searchedEntity : any = await this.strategies[folder]( id_entity );
        if( !searchedEntity ) throw CustomError.notFound('No puede borrarse el archivo de una entidad que no existe.');
        if( !searchedEntity.id_file ) throw CustomError.notFound('La entidad indicada no tiene un archivo asociado.');

        if( role !== 'admin' ) {
            if( folder === 'user' && id_entity !== id_user ) {
                throw CustomError.unauthorized('No puedes borrar el archivo de otro usuario.');
            }
            if( folder === 'course' && searchedEntity.id_owner != id_user ) {
                throw CustomError.unauthorized('No puedes borrar el archivo de un curso que no te pertenece.');
            }
            if( folder === 'lesson' ) {
                const course = await this.courseRepository.findCourseById( searchedEntity.id_course );
                if( !course ) throw CustomError.notFound('El curso al que pertenece la lección no existe.');
                if( course.id_owner != id_user ) {
                    throw CustomError.unauthorized('No puedes borrar el archivo de una lección de un curso que no te pertenece.');
                }
            }
        }

        const res = await this.fileRepository.deleteFile( searchedEntity.id_file );
        return res;
    }

}