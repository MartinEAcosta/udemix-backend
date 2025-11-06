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
    execute ( lessonRequestDto : UpdateLessonDto ) : Promise<LessonEntity>;
}

export class UpdateLesson implements UpdateLessonUseCase {

    constructor(
        private readonly courseRepository : CourseRepository,
        private readonly lessonRepository : LessonRepository,
     ) { }

    async execute( lessonRequestDto : UpdateLessonDto ) : Promise<LessonEntity> {
        const { id } = lessonRequestDto;
        const lesson = await this.lessonRepository.findLessonById( id );
        if( !lesson ) throw CustomError.notFound("La lección que intentas actualizar no existe.");
        
        const course = await this.courseRepository.findCourseById( lesson.id_course );
        if( !course ) throw CustomError.notFound("El curso al que quieres asignar la lección no existe.");
        
        return await this.lessonRepository.updateLesson( { 
                                                            ...lessonRequestDto,
                                                        } );
    }



}