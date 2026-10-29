import { CourseEntity } from "../entities/course.entity";

import { CourseFilterDto } from "../dtos/course/course-filter.dto";
import { CreateCourseDto } from "../dtos/course/create-course.dto";
import { UpdateCourseDto } from "../dtos/course/update-course.dto";
import { PaginatedResult, PaginationDto } from "../dtos/shared/pagination.dto";

export abstract class CourseRepository {

    abstract findAllCourses( filter : CourseFilterDto , pagination : PaginationDto ) : Promise<PaginatedResult<CourseEntity[]>>;
    abstract findCoursesByIds( id_courses : string[] ) : Promise<CourseEntity[]>;
    abstract findCourseById( id : string ) : Promise<CourseEntity | null>;
    abstract findCoursesByCategory( category_id : string ) : Promise<CourseEntity[]>;
    abstract saveCourse( createCourseDto : CreateCourseDto ) : Promise<CourseEntity>;
    abstract updateCourse( updateCourseDto : UpdateCourseDto ) : Promise<CourseEntity>;
    abstract deleteCourse( id : string ) : Promise<boolean>;
    
}
