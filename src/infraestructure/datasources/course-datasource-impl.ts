import { CreateCourseDto } from './../../domain/dtos/course/create-course.dto';
import { CourseEntity } from '../../domain/entities/course.entity';
import { CourseDatasource } from "../../domain/datasources/course.datasource";
import { CourseModel } from "../../data/mongo/models/course.model";
import { UpdateCourseDto } from '../../domain/dtos/course/update-course.dto';

export class CourseDatasourceImpl implements CourseDatasource {

    async getAllCourses(): Promise<CourseEntity[]> {
        const courses = await CourseModel.find({});
        return courses.map( CourseEntity.fromObject );
    }

    async getCourseById( id: string ): Promise<CourseEntity> {
        const course = await CourseModel.findById( id );
        
        if( !course ) throw `El curso con el id "${id}" no fue encontrado.`

        return CourseEntity.fromObject(course);
    }

    async saveCourse( createCourseDto : CreateCourseDto): Promise<CourseEntity> {
        // const userExists = await UserModel.findById( owner );

        // if( !userExists )
            // throw `El Usuario asignado como creador del curso no existe.`

        const newCourse = await CourseModel.create({
            ...createCourseDto
        });

        return CourseEntity.fromObject(newCourse);
    }


    async updateCourse( updateCourseDTO : UpdateCourseDto ) : Promise<CourseEntity>{
        const courseToUpdate = this.getCourseById( updateCourseDTO.id );

        const updatedCourse = await CourseModel.findByIdAndUpdate( updateCourseDTO.id , updateCourseDTO );

        return CourseEntity.fromObject( updatedCourse! );
    } 

    async deleteCourse( id : string ) : Promise<boolean>{
        throw `No implementado`;
    }
    
}