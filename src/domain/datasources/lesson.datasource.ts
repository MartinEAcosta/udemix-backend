import { CreateLessonDto } from "../dtos/lesson/create-lesson.dto";
import { LessonResponseDto } from "../dtos/lesson/lesson.response.dto";


export abstract class LessonDatasource {


    abstract createLesson( lessonRequestDto : CreateLessonDto ) : Promise<LessonResponseDto>;
    abstract deleteLesson( id : string ) : Promise<boolean>;
    abstract findAllLessonByCourseId( course_id : string ) : Promise<LessonResponseDto[]>;
    abstract findLessonById( id : string ) : Promise<LessonResponseDto | null>;

    
}