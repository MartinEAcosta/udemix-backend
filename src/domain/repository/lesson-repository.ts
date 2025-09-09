import { CreateLessonDto } from "../dtos/lesson/create-lesson.dto";
import { LessonEntity } from "../entities/lesson.entity";

export abstract class LessonRepository{

    abstract createLesson( lessonRequestDto : CreateLessonDto ) : Promise<LessonEntity>;
    abstract deleteLesson( id : string ) : Promise<boolean>;
    abstract findAllLessonsByCourseId( course_id : string ) : Promise<LessonEntity[]>;
    abstract findLessonById( id : string ) : Promise<LessonEntity | null>;
    
}