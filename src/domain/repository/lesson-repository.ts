import { CreateLessonDto } from "../dtos/lesson/create-lesson.dto";
import { LessonEntity } from "../entities/lesson.entity";

export abstract class LessonRepository{

    abstract createLesson( lessonRequestDto : CreateLessonDto ) : Promise<LessonEntity>;
    abstract findAllLessonsByCourseId( course_id : string ) : Promise<LessonEntity[]>;
    
}