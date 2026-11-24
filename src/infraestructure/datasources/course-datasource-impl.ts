import { Types } from "mongoose";

import { CourseDatasource } from "../../domain/datasources/course-datasource";
import { CourseModel, ICourseModel, ICourseWithOwnerModel } from "../../data/mongo/models/course.model";
import { CourseFilterDto } from "../../domain/dtos/course/course-filter.dto";
import { CreateCourseDto } from "../../domain/dtos/course/create-course.dto";
import { UpdateCourseDto } from "../../domain/dtos/course/update-course.dto";
import { SetCourseThumbnailDto } from "../../domain/dtos/course/set-course-thumbnail.dto";
import { CourseResponseDto, CourseWithOwnerResponseDto } from "../../domain/dtos/course/course.responses";
import { CourseMapper } from "../mappers/course.mapper";
import { PaginatedResult, PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { CourseQueryBuilder } from "../helpers/course-query-builder";
import { CustomError } from "../../domain/errors/custom-error";

export class CourseDatasourceImpl implements CourseDatasource {

    /**
     * Resuelve el profesor dueño del curso en un campo `owner` aparte.
     */
    private static readonly ownerLookupStages = [
        { $lookup : {
            from : 'users', localField : 'id_owner', foreignField : '_id', as : 'owner',
            pipeline : [{ $project : { first_name : 1 , last_name : 1 , avatar_url : 1 } }]
        }},
        // preserveNullAndEmptyArrays: sin esto, un curso cuyo owner ya no existe
        // desaparece del resultado en vez de devolverse sin owner.
        { $unwind : { path : '$owner' , preserveNullAndEmptyArrays : true } },
    ];

    async findAllCourses( filter : CourseFilterDto , pagination : PaginationDto ) : Promise<PaginatedResult<CourseWithOwnerResponseDto[]>> {
        const query = CourseQueryBuilder.fromFilter( filter );

        const [ courses , total ] = await Promise.all([
            CourseModel.aggregate<ICourseWithOwnerModel>([
                { $match : query },
                { $sort : { _id : 1 } },
                { $skip : (pagination.current_page - 1) * pagination.limit } , { $limit : pagination.limit },
                ...CourseDatasourceImpl.ownerLookupStages,
            ]),
            CourseModel.countDocuments(query)
            ]);

        return {
            items : courses.map( CourseMapper.fromCourseWithOwnerResponseDto ),
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

    async findCourseWithOwnerById( id : string ) : Promise<CourseWithOwnerResponseDto | null> {
        // $match no castea el id como lo hace findById, y new Types.ObjectId() tira con un
        // string inválido: se trata como "no encontrado" en vez de dejar escapar un CastError.
        if( !Types.ObjectId.isValid( id ) ) return null;

        const [ course ] = await CourseModel.aggregate<ICourseWithOwnerModel>([
            { $match : { _id : new Types.ObjectId( id ) } },
            ...CourseDatasourceImpl.ownerLookupStages,
        ]);
        if( !course ) return null;

        return CourseMapper.fromCourseWithOwnerResponseDto( course );
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
        // Whitelist explícita: se nombra cada campo en vez de spreadear el DTO, así una propiedad
        // que alguien agregue a la instancia (Object.assign, Object.create) nunca llega al $set.
        // Las claves undefined las descarta Mongoose ("no tocar").
        const { id } = updateCourseDTO;
        const fieldsToUpdate = {
            title         : updateCourseDTO.title,
            description   : updateCourseDTO.description,
            price         : updateCourseDTO.price,
            capacity      : updateCourseDTO.capacity,
            id_category   : updateCourseDTO.id_category,
            category_name : updateCourseDTO.category_name,
        };

        const updatedCourse = await CourseModel
                                        .findByIdAndUpdate(
                                            id,
                                            { $set : fieldsToUpdate },
                                            { new : true }
                                        )
                                        .lean<ICourseModel | null>();
        if( !updatedCourse ) throw CustomError.notFound('El curso que intentas actualizar no existe.');

        return CourseMapper.fromCourseResponseDto( updatedCourse );
    } 

    /**
     * El par id_file + thumbnail_url se escribe en un único $set sobre un solo documento, que
     * Mongo garantiza atómico: la copia desnormalizada no puede quedar apuntando a otro File
     * que el FK. Mismo molde que AuthDatasource.updateUserAvatar.
     */
    async setCourseThumbnail( thumbnailDto : SetCourseThumbnailDto ) : Promise<CourseResponseDto> {
        const updatedCourse = await CourseModel
                                        .findByIdAndUpdate(
                                            thumbnailDto.id_course,
                                            { $set : { id_file : thumbnailDto.id_file , thumbnail_url : thumbnailDto.thumbnail_url } },
                                            { new : true }
                                        )
                                        .lean<ICourseModel | null>();
        if( !updatedCourse ) throw CustomError.notFound('El curso del que intentas actualizar la portada no existe.');

        return CourseMapper.fromCourseResponseDto( updatedCourse );
    }

    async deleteCourse( id : string ) : Promise<boolean>{
        const hasRemoved = await CourseModel.deleteOne({ _id: id });

        return hasRemoved.deletedCount != 0;
    }
}
