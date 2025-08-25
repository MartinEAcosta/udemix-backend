import { CreateCourseDto } from './../../domain/dtos/course/create-course.dto';
import { CourseDatasource } from "../../domain/datasources/course.datasource";
import { CourseModel } from "../../data/mongo/models/course.model";
import { UpdateCourseDto } from '../../domain/dtos/course/update-course.dto';
import { CourseResponseDto } from '../../domain/dtos/course/course.responses';
import { CourseMapper } from '../mappers/course.mapper';

export class CourseDatasourceImpl implements CourseDatasource {

    async getAllCourses(): Promise<CourseResponseDto[]> {
        const courses = await CourseModel.find({});
        if( !courses ) return [];
        return courses.map( CourseMapper.fromCourseDto );
    }

    async getCourseById( id: string ): Promise<CourseResponseDto | null> {      
            const course = await CourseModel.findById({ _id: id });
            if( !course ) return null;

            return CourseMapper.fromCourseDto( course );
    }

    async saveCourse( createCourseDto : CreateCourseDto): Promise<CourseResponseDto> {
            // const userExists = await UserModel.findById( owner );
    
            // if( !userExists )
                // throw `El Usuario asignado como creador del curso no existe.`
            const newCourse = await CourseModel.create({
                ...createCourseDto
            });
            return CourseMapper.fromCourseDto( newCourse );
    }

    async updateCourse( updateCourseDTO : UpdateCourseDto ) : Promise<CourseResponseDto> {
        const updatedCourse = await CourseModel.findByIdAndUpdate(  {
                                                                         _id: updateCourseDTO.id 
                                                                    }, 
                                                                    updateCourseDTO,
                                                                    { new : true } 
                                                                ).exec();
                                                                
        return CourseMapper.fromCourseDto(updatedCourse!);
    } 

    async deleteCourse( id : string ) : Promise<boolean>{
        const hasRemoved = await CourseModel.deleteOne({ _id: id });
        if( hasRemoved.deletedCount != 0 ) return true;
        return false;
    }
}