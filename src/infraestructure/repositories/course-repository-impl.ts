import { CourseDatasource } from '../../domain/datasources/course.datasource';
import { CreateCourseDto } from '../../domain/dtos/course/create-course.dto';
import { UpdateCourseDto } from '../../domain/dtos/course/update-course.dto';
import { CourseEntity } from '../../domain/entities/course.entity';
import { CourseRepository } from '../../domain/repository/course-repository';

export class CourseRepositoryImpl implements CourseRepository{

    constructor( 
        private readonly courseDatasource : CourseDatasource, 
    ){ }

    getAllCourses() : Promise<CourseEntity[]> {
        return this.courseDatasource.getAllCourses();
    }

    getCourseById( id: string ) : Promise<CourseEntity> {
        return this.courseDatasource.getCourseById(id);
    }

    saveCourse( createCourseDto : CreateCourseDto ) : Promise<CourseEntity> {
        return this.courseDatasource.saveCourse( createCourseDto );
    }

    updateCourse( updateCourseDto : UpdateCourseDto ) : Promise<CourseEntity> {
        return this.courseDatasource.updateCourse( updateCourseDto );
    }

    deleteCourse( id: string ) : Promise<boolean> {
        return this.courseDatasource.deleteCourse(id);
    }
    

}