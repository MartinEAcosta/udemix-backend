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
            // El problema al llamar el Delete file es que espera el file_id y no el course_id.
            // Por lo tanto necesitaria una request al repo de cursos donde obtenga el curso, desestructurar el thumbnail
            // y obtener el file_id.
            const course = await this.courseRepository.getCourseById( id );

            if( !course ) return false;
            const { file_id , thumbnail_url, ...rest } = course;
            if( !file_id ) return false;

            const hasDeleted = await this.fileUploadRepository.deleteFile( file_id );
            if( !hasDeleted ) return false;

            const hasUpdatedCourse = await this.courseRepository.updateCourse( 
                                                                                { 
                                                                                    file_id : null,
                                                                                    thumbnail_url : null,
                                                                                    ...rest
                                                                                } 
                                                                            );
            return ( hasDeleted && hasUpdatedCourse ) ? true : false;
    }

    
}