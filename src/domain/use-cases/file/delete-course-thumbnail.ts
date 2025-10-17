import { CourseRepository } from "../../repository/course-repository";
import { FileUploadRepository } from "../../repository/file-upload-repository";

interface DeleteCourseThumbnailUseCase {
    execute( id : string ) : Promise<boolean>;
}

export class DeleteCourseThumbnail implements DeleteCourseThumbnailUseCase {

    constructor( 
        private readonly fileUploadRepository : FileUploadRepository,
        private readonly courseRepository : CourseRepository 
    ) { }

    execute = async( id : string ) : Promise<boolean> => {
            // Deberia de validar si el id del curso que me pasaron por param existe.
            // Si no existe, hubo un error al borrar el thumbnail.
            // Si existe, se deberia de llamar a la logica de borrado de file, es decir el caso de uso DeleteFile.
            // El problema al llamar el Delete file es que espera el id_file y no el course_id.
            // Por lo tanto necesitaria una request al repo de cursos donde obtenga el curso, desestructurar el thumbnail
            // y obtener el id_file.
            const course = await this.courseRepository.findCourseById( id );

            if( !course ) return false;
            const { id_file , thumbnail_url, ...rest } = course;
            if( !id_file ) return false;

            const hasDeleted = await this.fileUploadRepository.deleteFile( id_file );
            if( !hasDeleted ) return false;

            const hasUpdatedCourse = await this.courseRepository.updateCourse( 
                                                                                { 
                                                                                    id_file : null,
                                                                                    thumbnail_url : null,
                                                                                    ...rest
                                                                                } 
                                                                            );
            return ( hasDeleted && hasUpdatedCourse ) ? true : false;
    }

    
}