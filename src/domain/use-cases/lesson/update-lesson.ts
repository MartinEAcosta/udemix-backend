import { UpdateLessonDto } from "../../dtos/lesson/update-lesson.dto";
import { LessonRepository } from "../../repository/lesson-repository";
import { CourseRepository } from '../../repository/course-repository';
import { CustomError } from "../../errors/custom-error";
import { LessonEntity } from "../../entities/lesson.entity";

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
        
        const course = await this.courseRepository.findCourseById( lessonRequestDto.id_course );
        if( !course ) throw CustomError.notFound("El curso al que quieres asignar la lección no existe.");
        if( course.id_owner != lessonRequestDto.id_user ) throw CustomError.unauthorized('No eres el propietario, por lo tanto no puedes modificar lecciones.');

        // * MANEJOS DE LESSON_NUMBER , UNIT Y CHAPTER FALTA ¿COMO?
        const updatedLesson = await this.lessonRepository.updateLesson( lessonRequestDto );
        if( !updatedLesson ) throw CustomError.internalServer( 'Hubo un error inesperado al intentar actualizar la lección.');
        
        return updatedLesson;
    }



}