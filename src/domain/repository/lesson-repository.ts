import { CreateLessonDto } from "../dtos/lesson/create-lesson.dto";
import { LessonResponsePopulateDto } from "../dtos/lesson/lesson.response.dto";
import { UpdateLessonDto } from "../dtos/lesson/update-lesson.dto";
import { LessonEntity } from "../entities/lesson.entity";
import { TransactionSession } from "../services/UnitOfWork";

export abstract class LessonRepository{

    abstract createLesson( lessonRequestDto : CreateLessonDto , ts ?: TransactionSession ) : Promise<LessonEntity>;
    abstract updateLesson( lessonRequestDto : UpdateLessonDto ) : Promise<LessonEntity>;
    abstract deleteLesson( id : string ) : Promise<boolean>;
    abstract findAllLessonsByCourseId( course_id : string ) : Promise<LessonEntity[]>;
    abstract findAllLessonsPopulatedByCourseId( course_id : string ) : Promise<LessonResponsePopulateDto[]>;
    abstract findLessonById( id : string ) : Promise<LessonEntity | null>;
    abstract findLessonPopulatedById( id : string ) : Promise<LessonResponsePopulateDto | null>;
    abstract findLessonByLessonNumber ( id_course : string , lesson_number : number ) : Promise<LessonResponsePopulateDto | null>;

    
}