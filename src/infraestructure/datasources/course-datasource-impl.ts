import { CreateCourseDto } from './../../domain/dtos/course/create-course.dto';
import { CourseEntity } from '../../domain/entities/course.entity';
import { CourseDatasource } from "../../domain/datasources/course.datasource";
import { CourseModel, ICourseModel } from "../../data/mongo/models/course.model";
import { UpdateCourseDto } from '../../domain/dtos/course/update-course.dto';
import { CustomError } from '../../domain/errors/custom-error';

export class CourseDatasourceImpl implements CourseDatasource {

    async getAllCourses(): Promise<ICourseModel[]> {
        try{
            const courses = await CourseModel.find({});
            if( !courses ) return [];

            return courses;
        }
        catch(error){
            console.log(error);
            throw CustomError.internalServer('Error inesperado al intentar obtener los cursos.');
        }
    }

    async getCourseById( id: string ): Promise<ICourseModel> {
        try{
            const course = await CourseModel.findById( id );
        
            if( !course ) throw CustomError.badRequest(`El curso con el id "${id}" no fue encontrado.`);

            return course;
        }
        catch(error){
            console.log(error);
            throw CustomError.internalServer('Error inesperado al intentar obtener el curso.')
        }

    }

    async saveCourse( createCourseDto : CreateCourseDto): Promise<ICourseModel> {
        try{
            // const userExists = await UserModel.findById( owner );
    
            // if( !userExists )
                // throw `El Usuario asignado como creador del curso no existe.`
    
            const newCourse = await CourseModel.create({
                ...createCourseDto
            });
    
            return newCourse;
        }
        catch(error){
            console.log(error);
            throw CustomError.internalServer('Error inesperado al intentar crear el curso.')
        }
    }


    async updateCourse( updateCourseDTO : UpdateCourseDto ) : Promise<ICourseModel>{
        try{

            const courseToUpdate = this.getCourseById( updateCourseDTO.id );

            const updatedCourse = await CourseModel.findByIdAndUpdate( updateCourseDTO.id , updateCourseDTO );

            return updatedCourse!;
        }
        catch(error){
            console.log(error);
            throw CustomError.internalServer('Error inesperado al intentar actualizar el curso.');
        }
    } 

    async deleteCourse( id : string ) : Promise<boolean>{
        try{
            const courseToRemove = await this.getCourseById( id );
            if(!courseToRemove) return false;

            await CourseModel.deleteOne({ id : courseToRemove._id });
            return true;
        }
        catch(error){
            console.log(error);
            throw CustomError.internalServer('Error inesperaado al intentar remover el curso.');
        }
    }
}