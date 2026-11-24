import { CourseRepository } from "../../repository/course-repository";
import { FileRepository } from '../../repository/file-repository';
import { CustomError } from "../../errors/custom-error";
import { SetCourseThumbnailDto } from "../../dtos/course/set-course-thumbnail.dto";

interface DeleteCourseThumbnailUseCase {
    execute( id : string , id_user : string , role : string ) : Promise<boolean>;
}

export class DeleteCourseThumbnail implements DeleteCourseThumbnailUseCase {

    constructor(
        private readonly fileRepository : FileRepository,
        private readonly courseRepository : CourseRepository
    ) { }

    execute = async( id : string , id_user : string , role : string ) : Promise<boolean> => {
            const course = await this.courseRepository.findCourseById( id );

            if( !course ) return false;

            if( course.id_owner != id_user && role !== 'admin' ) {
                throw CustomError.unauthorized('No puedes borrar la portada de un curso que no te pertenece.');
            }
            const { id_file } = course;
            if( !id_file ) return false;

            const hasDeleted = await this.fileRepository.deleteFile( id_file );
            if( !hasDeleted ) return false;

            const hasUpdatedCourse = await this.courseRepository.setCourseThumbnail(
                                                                    SetCourseThumbnailDto.cleared( id )
                                                                );
            return ( hasDeleted && hasUpdatedCourse ) ? true : false;
    }

    
}