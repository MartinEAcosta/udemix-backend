import { CourseEntity } from "../entities/course.entity";

import { CreateCourseDto } from "../dtos/course/create-course.dto";
import { UpdateCourseDto } from "../dtos/course/update-course.dto";
import { PaginationDto, PaginationResponseDto } from "../dtos/shared/pagination.dto";
import { CourseQueryFilter } from "../helpers/course-query-builder";

export abstract class CourseRepository {

    abstract findAllCourses( filter ?: CourseQueryFilter , pagination ?: PaginationDto ) : Promise<PaginationResponseDto<CourseEntity[]>>;
    abstract findCoursesByIds( id_courses : string[] ) : Promise<CourseEntity[]>;
    abstract findCoursesPaginated( page : number , limit : number ) : Promise<PaginationResponseDto<CourseEntity[]>>;
    abstract findCourseById( id : string ) : Promise<CourseEntity | null>;
    abstract findCoursesByCategory( category_id : string ) : Promise<CourseEntity[]>;
    abstract saveCourse( createCourseDto : CreateCourseDto ) : Promise<CourseEntity>;
    abstract updateCourse( updateCourseDto : UpdateCourseDto ) : Promise<CourseEntity>;
    abstract deleteCourse( id : string ) : Promise<boolean>;
    
}