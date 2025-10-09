import { CreateCourseDto } from './../../domain/dtos/course/create-course.dto';
import { CourseDatasource } from "../../domain/datasources/course.datasource";
import { CourseModel } from "../../data/mongo/models/course.model";
import { UpdateCourseDto } from '../../domain/dtos/course/update-course.dto';
import { CourseResponseDto } from '../../domain/dtos/course/course.responses';
import { CourseMapper } from '../mappers/course.mapper';
import { PaginationResponseDto } from '../../domain/dtos/shared/pagination.dto';

export class CourseDatasourceImpl implements CourseDatasource {
    
    async findAllCourses(): Promise<CourseResponseDto[]> {
        const courses = await CourseModel.find({});
        if( !courses ) return [];
        return courses.map( CourseMapper.fromCourseResponseDto );
    }
    
    async findCoursesPaginated( page : number , limit : number ) : Promise<PaginationResponseDto<CourseResponseDto[]>> {

        const courses  = await CourseModel.find({})
                                            .skip( (page - 1 ) * limit)
                                            .limit( limit );

        const founded = courses.map( CourseMapper.fromCourseResponseDto );

        return{
            page,
            limit,
            total : founded.length,
            next  : null,
            prev  : null,
            items : founded,
        };
    }

    async findCourseById( id: string ): Promise<CourseResponseDto | null> {   
        const course = await CourseModel.findById({ _id: id });
        if( !course ) return null;
        
        return CourseMapper.fromCourseResponseDto( course );
    }
    
    async findCoursesByCategoryId( category_id : string ) : Promise<CourseResponseDto[]> {
        const courses = await CourseModel.find({ id_category : category_id  });

        return courses.map( course => CourseMapper.fromCourseResponseDto( course ));
    }

    async saveCourse( createCourseDto : CreateCourseDto): Promise<CourseResponseDto> {
        // TODO: delegar al caso de uso.
        // const userExists = await UserModel.findById( owner );

        // if( !userExists )
            // throw `El Usuario asignado como creador del curso no existe.`
        const newCourse = await CourseModel.create({
            ...createCourseDto
        });
        return CourseMapper.fromCourseResponseDto( newCourse );
    }

    async updateCourse( updateCourseDTO : UpdateCourseDto ) : Promise<CourseResponseDto> {
        const updatedCourse = await CourseModel
                                        .findByIdAndUpdate(  
                                            {
                                                _id: updateCourseDTO.id 
                                            }, 
                                            updateCourseDTO,
                                            { new : true } 
                                        ).exec();
        
        return CourseMapper.fromCourseResponseDto(updatedCourse!);
    } 

    async deleteCourse( id : string ) : Promise<boolean>{
        const hasRemoved = await CourseModel.deleteOne({ _id: id });
        if( hasRemoved.deletedCount != 0 ) return true;
        return false;
    }
}