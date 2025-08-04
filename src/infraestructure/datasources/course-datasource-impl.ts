import { CreateCourseDto } from './../../domain/dtos/course/create-course.dto';
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

    async getCourseById( id: string ): Promise<ICourseModel | null> {
        try{
            const course = await CourseModel.findById({ _id: id });

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

            const updatedCourse = await CourseModel.findByIdAndUpdate({ _id: updateCourseDTO.id } , updateCourseDTO ).exec();
            
            return updatedCourse!;
        }
        catch(error){
            console.log(error);
            throw CustomError.internalServer('Error inesperado al intentar actualizar el curso.');
        }
    } 

    async deleteCourse( id : string ) : Promise<boolean>{
        try{
            const hasRemoved = await CourseModel.deleteOne({ _id: id });
            if( hasRemoved.deletedCount != 0 ) return true;
            
            return false;
        }
        catch(error){
            console.log(error);
            throw CustomError.internalServer('Error inesperaado al intentar remover el curso.');
        }
    }
}