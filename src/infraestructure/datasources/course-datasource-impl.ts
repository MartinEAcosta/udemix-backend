import { CourseDatasource } from "../../domain/datasources/course-datasource";
import { CourseModel, ICourseModel, ICoursePopulateOwnerModel } from "../../data/mongo/models/course.model";
import { CourseFilterDto } from "../../domain/dtos/course/course-filter.dto";
import { CreateCourseDto } from "../../domain/dtos/course/create-course.dto";
import { UpdateCourseDto } from "../../domain/dtos/course/update-course.dto";
import { CoursePopulateOwnerResponseDto, CourseResponseDto } from "../../domain/dtos/course/course.responses";
import { CourseMapper } from "../mappers/course.mapper";
import { PaginatedResult, PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { CourseQueryBuilder } from "../helpers/course-query-builder";
import { CustomError } from "../../domain/errors/custom-error";

export class CourseDatasourceImpl implements CourseDatasource {
    
    async findAllCourses( filter : CourseFilterDto , pagination : PaginationDto ) : Promise<PaginatedResult<CourseResponseDto[]>> {
        const query = CourseQueryBuilder.fromFilter( filter );

        const [ courses , total ] = await Promise.all([
            CourseModel.find( query )
                .skip( ( pagination.current_page - 1 ) * pagination.limit )
                .limit( pagination.limit )
                .lean<ICourseModel[]>(),
            CourseModel.countDocuments( query ),
        ]);

        return {
            items : courses.map( CourseMapper.fromCourseResponseDto ),
            total,
        };
    }

    async findCoursesByIds( id_courses : string[] ) : Promise<CourseResponseDto[]> {
        const courses = await CourseModel.find( { _id : { $in : id_courses } } ).lean<ICourseModel[]>();

        return courses.map( CourseMapper.fromCourseResponseDto );
    }

    async findCourseById( id: string ) : Promise<CourseResponseDto | null> {   
        const course = await CourseModel.findById( id ).lean<ICourseModel | null>();
        if( !course ) return null;
        
        return CourseMapper.fromCourseResponseDto( course );
    }

    async findCoursePopulatedById( id : string ) : Promise<CoursePopulateOwnerResponseDto | null> {
        const course = await CourseModel.findById( id )
                                        .populate( 'id_owner' , 'username email avatar_url' )
                                        .lean<ICoursePopulateOwnerModel | null>();
        if( !course ) return null;
        if( !course.id_owner ) throw CustomError.internalServer('El curso no tiene un propietario válido.');

        return CourseMapper.fromCoursePopulateOwnerResponseDto( { ...course , id_owner : course.id_owner } );
    }
    
    async findCoursesByCategoryId( category_id : string ) : Promise<CourseResponseDto[]> {
        const courses = await CourseModel.find({ id_category : category_id }).lean<ICourseModel[]>();

        return courses.map( CourseMapper.fromCourseResponseDto );
    }

    async saveCourse( createCourseDto : CreateCourseDto) : Promise<CourseResponseDto> {
        const newCourse = await CourseModel.create({
            ...createCourseDto
        });

        return CourseMapper.fromCourseResponseDto( newCourse );
    }

    async updateCourse( updateCourseDTO : UpdateCourseDto ) : Promise<CourseResponseDto> {
        const { id , ...changes } = updateCourseDTO;

        const updatedCourse = await CourseModel
                                        .findByIdAndUpdate(
                                            id,
                                            changes,
                                            { new : true }
                                        )
                                        .lean<ICourseModel | null>();
        if( !updatedCourse ) throw CustomError.notFound('El curso que intentas actualizar no existe.');

        return CourseMapper.fromCourseResponseDto( updatedCourse );
    } 

    async deleteCourse( id : string ) : Promise<boolean>{
        const hasRemoved = await CourseModel.deleteOne({ _id: id });

        return hasRemoved.deletedCount != 0;
    }
}
