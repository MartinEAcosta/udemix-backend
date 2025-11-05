import { CreateCourseDto } from './../../domain/dtos/course/create-course.dto';
import { CourseDatasource } from "../../domain/datasources/course-datasource";
import { CourseModel } from "../../data/mongo/models/course.model";
import { UpdateCourseDto } from '../../domain/dtos/course/update-course.dto';
import { CourseResponseDto } from '../../domain/dtos/course/course.responses';
import { CourseMapper } from '../mappers/course.mapper';
import { PaginationResponseDto } from '../../domain/dtos/shared/pagination.dto';
import { CourseQueryFilter } from '../../domain/helpers/course-query-builder';

export class CourseDatasourceImpl implements CourseDatasource {
    
    async findAllCourses( filter ?: CourseQueryFilter ): Promise<CourseResponseDto[]> {
        const courses = await CourseModel.find( filter || {} );
        if( !courses ) return [];
        
        return courses.map( CourseMapper.fromCourseResponseDto );
    }

    async findCoursesByIds( id_courses : string[] ) : Promise<CourseResponseDto[]> {
        const courses = await CourseModel.find( { _id : { $in : id_courses } } );
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

    async findCourseById( id: string ) : Promise<CourseResponseDto | null> {   
        const course = await CourseModel.findById({ _id: id });
        if( !course ) return null;
        
        return CourseMapper.fromCourseResponseDto( course );
    }
    
    async findCoursesByCategoryId( category_id : string ) : Promise<CourseResponseDto[]> {
        const courses = await CourseModel.find({ id_category : category_id });

        return courses.map( course => CourseMapper.fromCourseResponseDto( course ));
    }


    async saveCourse( createCourseDto : CreateCourseDto) : Promise<CourseResponseDto> {

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