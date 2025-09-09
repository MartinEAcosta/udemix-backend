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

        let lessonToCreate = lessonRequestDto;
        
        const { id_course } = lessonRequestDto;
        const lessonsFromCourse = await this.lessonRepository.findAllLessonsByCourseId( id_course );
        if( lessonsFromCourse ){
            const lastLesson = lessonsFromCourse.pop();
            lessonToCreate = {
                ...lessonRequestDto,
                lesson_number: lastLesson!.lesson_number + 1,
            };
        }
        
        const createdLesson = await this.lessonRepository.createLesson( lessonToCreate );
        if( !createdLesson ) throw CustomError.internalServer('Hubo un error a la hora de intentar crear el curso.');

        return createdLesson;
    }
    
}