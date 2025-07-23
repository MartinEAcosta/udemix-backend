import { CourseDatasource } from '../../domain/datasources/course.datasource';
import { CreateCourseDto } from '../../domain/dtos/course/create-course.dto';
import { UpdateCourseDto } from '../../domain/dtos/course/update-course.dto';
import { CourseEntity } from '../../domain/entities/course.entity';
import { CourseRepository } from '../../domain/repository/course-repository';

export class CourseRepositoryImpl implements CourseRepository{

    constructor( 
        private readonly courseDatasource : CourseDatasource, 
    ){ }

    async getAllCourses() : Promise<CourseEntity[]> {
        const courses = await this.courseDatasource.getAllCourses();
        return courses.map( course => CourseEntity.fromObject(course) );
    }

    async getCourseById( id: string ) : Promise<CourseEntity> {
        const course = await this.courseDatasource.getCourseById(id);
        return CourseEntity.fromObject( course );
    }

    async saveCourse( createCourseDto : CreateCourseDto ) : Promise<CourseEntity> {
        const courseSaved = await this.courseDatasource.saveCourse( createCourseDto );
        return CourseEntity.fromObject( courseSaved );
    }

    async updateCourse( updateCourseDto : UpdateCourseDto ) : Promise<CourseEntity> {
        const courseUpdated = await this.courseDatasource.updateCourse( updateCourseDto );
        return CourseEntity.fromObject(courseUpdated)
    }

    deleteCourse( id: string ) : Promise<boolean> {
        return this.courseDatasource.deleteCourse(id);
    }
    

}