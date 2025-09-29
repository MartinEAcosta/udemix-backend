import { CreateLessonDto } from "../dtos/lesson/create-lesson.dto";
import { LessonResponseDto, LessonResponsePopulateDto } from "../dtos/lesson/lesson.response.dto";
import { UpdateLessonDto } from "../dtos/lesson/update-lesson.dto";


export abstract class LessonDatasource {


    abstract createLesson( lessonRequestDto : CreateLessonDto ) : Promise<LessonResponseDto>;
    abstract updateLesson( lessonRequestDto : UpdateLessonDto ) : Promise<LessonResponseDto>;
    abstract deleteLesson( id : string ) : Promise<boolean>;
    abstract findAllLessonsByCourseId( course_id : string ) : Promise<LessonResponseDto[]>;
    abstract findAllLessonsPopulatedByCourseId( course_id : string ) : Promise<LessonResponsePopulateDto[]>;
    abstract findLessonById( id : string ) : Promise<LessonResponseDto | null>;

    
}