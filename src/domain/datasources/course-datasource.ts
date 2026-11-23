import { CourseFilterDto } from "../dtos/course/course-filter.dto";
import { CourseResponseDto, CourseWithOwnerResponseDto } from "../dtos/course/course.responses";
import { CreateCourseDto } from "../dtos/course/create-course.dto";
import { UpdateCourseDto } from "../dtos/course/update-course.dto";
import { PaginatedResult, PaginationDto } from "../dtos/shared/pagination.dto";

export abstract class CourseDatasource {

    abstract findAllCourses( filter : CourseFilterDto , pagination : PaginationDto ) : Promise<PaginatedResult<CourseWithOwnerResponseDto[]>>;
    abstract findCoursesByIds( id_courses : string[] ) : Promise<CourseResponseDto[]>;
    /** Lectura liviana, sin el owner: la usan los checks de propiedad de archivos y cursos. */
    abstract findCourseById( id : string ) : Promise<CourseResponseDto | null>;
    /** Lectura para mostrar: trae nombre y avatar del profesor resueltos por $lookup. */
    abstract findCourseWithOwnerById( id : string ) : Promise<CourseWithOwnerResponseDto | null>;
    abstract findCoursesByCategoryId ( category_id : string ) : Promise<CourseResponseDto[]>;
    abstract saveCourse( createCourseDto : CreateCourseDto ) : Promise<CourseResponseDto>;
    abstract updateCourse( updateCourseDto : UpdateCourseDto ) : Promise<CourseResponseDto>;
    abstract deleteCourse( id : string ) : Promise<boolean>;
    
}
