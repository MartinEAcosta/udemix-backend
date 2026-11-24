import { CourseFilterDto } from "../dtos/course/course-filter.dto";
import { CourseResponseDto, CourseWithOwnerResponseDto } from "../dtos/course/course.responses";
import { CreateCourseDto } from "../dtos/course/create-course.dto";
import { UpdateCourseDto } from "../dtos/course/update-course.dto";
import { SetCourseThumbnailDto } from "../dtos/course/set-course-thumbnail.dto";
import { PaginatedResult, PaginationDto } from "../dtos/shared/pagination.dto";

export abstract class CourseDatasource {

    abstract findAllCourses( filter : CourseFilterDto , pagination : PaginationDto ) : Promise<PaginatedResult<CourseWithOwnerResponseDto[]>>;
    abstract findCoursesByIds( id_courses : string[] ) : Promise<CourseResponseDto[]>;
    abstract findCourseById( id : string ) : Promise<CourseResponseDto | null>;
    abstract findCourseWithOwnerById( id : string ) : Promise<CourseWithOwnerResponseDto | null>;
    abstract findCoursesByCategoryId ( category_id : string ) : Promise<CourseResponseDto[]>;
    abstract saveCourse( createCourseDto : CreateCourseDto ) : Promise<CourseResponseDto>;
    abstract updateCourse( updateCourseDto : UpdateCourseDto ) : Promise<CourseResponseDto>;
    /** Único camino para escribir id_file + thumbnail_url. updateCourse no los toca. */
    abstract setCourseThumbnail( thumbnailDto : SetCourseThumbnailDto ) : Promise<CourseResponseDto>;
    abstract deleteCourse( id : string ) : Promise<boolean>;
    
}
