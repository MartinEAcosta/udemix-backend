import { CourseFilterDto } from "../dtos/course/course-filter.dto";
import { CoursePopulateOwnerResponseDto, CourseResponseDto } from "../dtos/course/course.responses";
import { CreateCourseDto } from "../dtos/course/create-course.dto";
import { UpdateCourseDto } from "../dtos/course/update-course.dto";
import { PaginatedResult, PaginationDto } from "../dtos/shared/pagination.dto";

export abstract class CourseDatasource {

    abstract findAllCourses( filter : CourseFilterDto , pagination : PaginationDto ) : Promise<PaginatedResult<CourseResponseDto[]>>;
    abstract findCoursesByIds( id_courses : string[] ) : Promise<CourseResponseDto[]>;
    abstract findCourseById( id : string ) : Promise<CourseResponseDto | null>;
    abstract findCoursePopulatedById( id : string ) : Promise<CoursePopulateOwnerResponseDto | null>;
    abstract findCoursesByCategoryId ( category_id : string ) : Promise<CourseResponseDto[]>;
    abstract saveCourse( createCourseDto : CreateCourseDto ) : Promise<CourseResponseDto>;
    abstract updateCourse( updateCourseDto : UpdateCourseDto ) : Promise<CourseResponseDto>;
    abstract deleteCourse( id : string ) : Promise<boolean>;
    
}
