import { CourseEntity } from "../entities/course.entity";

import { CreateCourseDto } from "../dtos/course/create-course.dto";
import { UpdateCourseDto } from "../dtos/course/update-course.dto";

export abstract class CourseRepository {

    abstract getAllCourses( ) : Promise<CourseEntity[]>;
    abstract getCourseById( id : string ) : Promise<CourseEntity | null>;
    abstract saveCourse( createCourseDto : CreateCourseDto ) : Promise<CourseEntity>;
    abstract updateCourse( updateCourseDto : UpdateCourseDto ) : Promise<CourseEntity>;
    abstract deleteCourse( id : string ) : Promise<boolean>;
    
}