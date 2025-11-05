import { UpdateLessonDto } from "../../dtos/lesson/update-lesson.dto";
import { LessonRepository } from "../../repository/lesson-repository";
import { CourseRepository } from '../../repository/course-repository';
import { CustomError } from "../../errors/custom-error";
import { LessonEntity } from "../../entities/lesson.entity";
import { UploadFileDto } from "../../dtos/file-upload/file-upload.dto";
import { FileRepository } from "../../repository/file-repository";
        // * MANEJOS DE LESSON_NUMBER , UNIT Y CHAPTER FALTA ¿COMO?
        // * MANEJOS DE LESSON_NUMBER , UNIT Y CHAPTER FALTA ¿COMO?
        // * MANEJOS DE LESSON_NUMBER , UNIT Y CHAPTER FALTA ¿COMO?
        // * MANEJOS DE LESSON_NUMBER , UNIT Y CHAPTER FALTA ¿COMO?
        // * MANEJOS DE LESSON_NUMBER , UNIT Y CHAPTER FALTA ¿COMO?

interface UpdateLessonUseCase {
    execute ( lessonRequestDto : UpdateLessonDto , file ?: UploadFileDto ) : Promise<LessonEntity>;
}

export class UpdateLesson implements UpdateLessonUseCase {

    constructor(
        private readonly courseRepository : CourseRepository,
        private readonly lessonRepository : LessonRepository,
        private readonly fileRepository   : FileRepository,
        
     ) { }

    async execute( lessonRequestDto : UpdateLessonDto , file ?: UploadFileDto) : Promise<LessonEntity> {
        const { id } = lessonRequestDto;
        const lesson = await this.lessonRepository.findLessonById( id );
        if( !lesson ) throw CustomError.notFound("La lección que intentas actualizar no existe.");
        
        const course = await this.courseRepository.findCourseById( lesson.id_course );
        if( !course ) throw CustomError.notFound("El curso al que quieres asignar la lección no existe.");
        
        if( file ){
            
            if( lesson.id_file ){
                const oldFile = await this.fileRepository.deleteFile( lesson.id_file );
                if( !oldFile ) throw CustomError.internalServer('Hubo un error al borrar la referencia del contenido de la lección.')
            }

            const fileUploaded = await this.fileRepository.uploadFile( file , 'lessons' );
            if( !fileUploaded ) throw CustomError.internalServer( 'Hubo un error al intentar cargar el contenido a la lección.');

            return await this.lessonRepository.updateLesson( { 
                                                                ...lessonRequestDto,
                                                                id_file : fileUploaded.id
                                                            } );
        }
        else{
            return await this.lessonRepository.updateLesson( lessonRequestDto );
        }
    }



}