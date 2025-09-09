import { CourseResponseDto } from "../dtos/course/course.responses";
import { CreateCourseDto } from "../dtos/course/create-course.dto";
import { UpdateCourseDto } from "../dtos/course/update-course.dto";

export abstract class CourseDatasource {

    abstract findAllCourses( ) : Promise<CourseResponseDto[]>;
    abstract findCourseById( id : string ) : Promise<CourseResponseDto | null>;
    abstract findCoursesByCategoryId ( category_id : string ) : Promise<CourseResponseDto[]>;
    abstract saveCourse( createCourseDto : CreateCourseDto ) : Promise<CourseResponseDto>;
    abstract updateCourse( updateCourseDto : UpdateCourseDto ) : Promise<CourseResponseDto>;
    abstract deleteCourse( id : string ) : Promise<boolean>;
    
}