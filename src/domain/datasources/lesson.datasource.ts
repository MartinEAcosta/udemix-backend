import { CreateLessonDto } from "../dtos/lesson/create-lesson.dto";
import { LessonResponseDto, LessonResponsePopulateDto } from '../dtos/lesson/lesson.response.dto';
import { UpdateLessonDto } from "../dtos/lesson/update-lesson.dto";
import { TransactionSession } from "../services/UnitOfWork";


export abstract class LessonDatasource {


    abstract createLesson( lessonRequestDto : CreateLessonDto , ts ?: TransactionSession ) : Promise<LessonResponseDto>;
    abstract updateLesson( lessonRequestDto : UpdateLessonDto ) : Promise<LessonResponseDto>;
    abstract deleteLesson( id : string ) : Promise<boolean>;
    abstract findAllLessonsByCourseId( id_course : string ) : Promise<LessonResponseDto[]>;
    abstract findAllLessonsPopulatedByCourseId( id_course : string ) : Promise<LessonResponsePopulateDto[]>;
    abstract findLessonById( id : string ) : Promise<LessonResponseDto | null>;

    
}