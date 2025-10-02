import { CreateLessonDto } from "../../dtos/lesson/create-lesson.dto";
import { LessonEntity } from "../../entities/lesson.entity";
import { CustomError } from "../../errors/custom-error";
import { LessonRepository } from "../../repository/lesson-repository";
import { CourseRepository } from '../../repository/course-repository';

interface CreateLessonUseCase {
    execute( lessonRequestDto : CreateLessonDto , uid : string) : Promise<LessonEntity>;
}

export class CreateLesson implements CreateLessonUseCase {

    constructor( 
        private readonly courseRepository : CourseRepository,
        private readonly lessonRepository : LessonRepository,
    ) { }

    async execute( lessonRequestDto : CreateLessonDto ) : Promise<LessonEntity> {

        const { id_course } = lessonRequestDto;
        const course = await this.courseRepository.findCourseById( id_course );
        if( !course ) throw CustomError.notFound("El curso al que quieres asignar la lección no existe.");
        
        if( course.id_owner != lessonRequestDto.id_user ) throw CustomError.unauthorized('No eres el propietario, por lo tanto no puedes añadir lecciones.');

        const arrayLessons = await this.lessonRepository.findAllLessonsByCourseId( id_course );
        const lastLesson = arrayLessons.pop();
        const { lesson_number , ...rest } = lessonRequestDto;
                                                                            
        const createdLesson = await this.lessonRepository.createLesson( 
                                                                        {
                                                                            lesson_number : lastLesson ? lastLesson.lesson_number+1 : 0,
                                                                            ...rest,
                                                                        } 
                                                                      );
        if( !createdLesson ) throw CustomError.internalServer('Hubo un error a la hora de intentar crear el curso.');

        return createdLesson;
    }
    
}