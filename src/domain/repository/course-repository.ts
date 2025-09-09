import { CourseEntity } from "../entities/course.entity";

import { CreateCourseDto } from "../dtos/course/create-course.dto";
import { UpdateCourseDto } from "../dtos/course/update-course.dto";

export abstract class CourseRepository {

    abstract findAllCourses( ) : Promise<CourseEntity[]>;
    abstract findCourseById( id : string ) : Promise<CourseEntity | null>;
    abstract findCoursesByCategory( category_id : string ) : Promise<CourseEntity[]>;
    abstract saveCourse( createCourseDto : CreateCourseDto ) : Promise<CourseEntity>;
    abstract updateCourse( updateCourseDto : UpdateCourseDto ) : Promise<CourseEntity>;
    abstract deleteCourse( id : string ) : Promise<boolean>;
    
}