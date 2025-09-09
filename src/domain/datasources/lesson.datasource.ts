import { CreateLessonDto } from "../dtos/lesson/create-lesson.dto";


export abstract class LessonDatasource {

    abstract createLesson( lessonRequestDto : CreateLessonDto ) : Promise<LessonResponseDto>;
    abstract findAllLessonByCourseId( course_id : string ) : Promise<LessonResponseDto[]>;

    
}