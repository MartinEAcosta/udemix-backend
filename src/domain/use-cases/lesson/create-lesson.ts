import { CreateLessonDto } from "../../dtos/lesson/create-lesson.dto";
import { LessonEntity } from "../../entities/lesson.entity";
import { CustomError } from "../../errors/custom-error";
import { LessonRepository } from "../../repository/lesson-repository";

interface CreateLessonUseCase {
    execute( lessonRequestDto : CreateLessonDto ) : Promise<LessonEntity>;
}

export class CreateLesson implements CreateLessonUseCase {

    constructor( 
        private readonly lessonRepository : LessonRepository,
    ) { }

    async execute( lessonRequestDto : CreateLessonDto ) : Promise<LessonEntity> {

        const { id_course } = lessonRequestDto;
        const arrayLessons = await this.lessonRepository.findAllLessonsByCourseId( id_course );
        if( !arrayLessons ) throw CustomError.notFound("El curso al que quieres asignar la lección no existe.");

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