import { CourseDatasource } from '../../domain/datasources/course.datasource';
import { CreateCourseDto } from '../../domain/dtos/course/create-course.dto';
import { UpdateCourseDto } from '../../domain/dtos/course/update-course.dto';
import { CourseEntity } from '../../domain/entities/course.entity';
import { CustomError } from '../../domain/errors/custom-error';
import { CourseRepository } from '../../domain/repository/course-repository';

export class CourseRepositoryImpl implements CourseRepository{

    constructor( 
        private readonly courseDatasource : CourseDatasource, 
    ){ }

    async getAllCourses() : Promise<CourseEntity[]> {
        try{
            const courses = await this.courseDatasource.getAllCourses();
            return courses.map( course => CourseEntity.fromObject(course) );
        }
        catch( error ){
            throw CustomError.internalServer('Hubo un error al obtener todos los cursos.')
        }
    }

    async getCourseById( id: string ) : Promise<CourseEntity | null> {
        try{
            const course = await this.courseDatasource.getCourseById(id);
            return course ? CourseEntity.fromObject( course ) : null;
        }
        catch( error ){
            throw CustomError.internalServer('Hubo un error al obtener el curso.');
        }
    }

    async saveCourse( createCourseDto : CreateCourseDto ) : Promise<CourseEntity> {
        try{
            const courseSaved = await this.courseDatasource.saveCourse( createCourseDto );
            return CourseEntity.fromObject( courseSaved );
        }
        catch( error ){
            console.log(error);
            throw CustomError.internalServer('Hubo un error al crear el curso.');
        }
            
    }

    async updateCourse( updateCourseDto : UpdateCourseDto ) : Promise<CourseEntity> {
        try{
            const courseUpdated = await this.courseDatasource.updateCourse( updateCourseDto );
            return CourseEntity.fromObject(courseUpdated);
        }
        catch( error ){
            throw CustomError.internalServer('Hubo un error al actualizar el curso.');
        }
    }

    async deleteCourse( id: string ) : Promise<boolean> {
        try{
            const removed =  await this.courseDatasource.deleteCourse( id );
    
            return removed;
        }
        catch( error ){
            throw CustomError.internalServer('Hubo un error al eliminar el curso.');
        }
    }
    

}