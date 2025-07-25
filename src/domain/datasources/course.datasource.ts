import { ICourseModel } from "../../data";
import { CreateCourseDto } from "../dtos/course/create-course.dto";
import { UpdateCourseDto } from "../dtos/course/update-course.dto";
import { CourseEntity } from "../entities/course.entity";


export abstract class CourseDatasource {

    abstract getAllCourses( ) : Promise<ICourseModel[]>;
    abstract getCourseById( id : string ) : Promise<ICourseModel | null>;
    abstract saveCourse( createCourseDto : CreateCourseDto ) : Promise<ICourseModel>;
    abstract updateCourse( updateCourseDto : UpdateCourseDto ) : Promise<ICourseModel>;
    abstract deleteCourse( id : string ) : Promise<boolean>;
    
}