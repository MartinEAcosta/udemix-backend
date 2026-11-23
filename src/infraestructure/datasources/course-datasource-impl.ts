import { Types } from "mongoose";

import { CourseDatasource } from "../../domain/datasources/course-datasource";
import { CourseModel, ICourseModel, ICourseWithOwnerModel } from "../../data/mongo/models/course.model";
import { CourseFilterDto } from "../../domain/dtos/course/course-filter.dto";
import { CreateCourseDto } from "../../domain/dtos/course/create-course.dto";
import { UpdateCourseDto } from "../../domain/dtos/course/update-course.dto";
import { CourseResponseDto, CourseWithOwnerResponseDto } from "../../domain/dtos/course/course.responses";
import { CourseMapper } from "../mappers/course.mapper";
import { PaginatedResult, PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { CourseQueryBuilder } from "../helpers/course-query-builder";
import { pickFields } from "../helpers/pick-fields";
import { CustomError } from "../../domain/errors/custom-error";

export class CourseDatasourceImpl implements CourseDatasource {

    /**
     * Claves que el update genérico de curso puede escribir.
     *
     * Afuera a propósito:
     *  - `current_enrolled`: sólo se mueve con el $inc de saveEnrollment. Escribirlo desde acá
     *    pisa un incremento concurrente con un valor leído antes — y pasa de verdad:
     *    delete-course-thumbnail arrastra una CourseEntity entera de una lectura previa.
     *  - `id_owner`: no existe feature de transferencia de propiedad.
     *  - `spots_remaining` / `owner`: derivados, nunca se persisten.
     */
    private static readonly UPDATABLE_COURSE_FIELDS = [
        'title' , 'description' , 'id_category' , 'category_name',
        'thumbnail_url' , 'id_file' , 'price' , 'capacity',
    ] as const;

    /**
     * Resuelve el profesor dueño del curso en un campo `owner` aparte.
     *
     * Proyecta `avatar_url` directo del usuario: no hace falta un segundo $lookup a `files`
     * porque la url está desnormalizada en el documento (ver IUserModel.avatar_url).
     *
     * A diferencia de .populate, NO sobreescribe `id_owner`: CourseEntity.fromObject exige un
     * id_owner no vacío, así que reemplazarlo por el documento haría fallar la lectura de un
     * curso cuyo owner ya fue borrado.
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
                // Sin un orden explícito, Mongo no garantiza el mismo orden entre llamadas:
                // los límites de página se corren y un curso puede repetirse o no aparecer nunca.
                { $sort : { _id : 1 } },
                { $skip : (pagination.current_page - 1) * pagination.limit } , { $limit : pagination.limit },
                // El $lookup va después del $limit para que el join toque sólo la página actual.
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
        const fieldsToUpdate = pickFields( updateCourseDTO , CourseDatasourceImpl.UPDATABLE_COURSE_FIELDS );

        const updatedCourse = await CourseModel
                                        .findByIdAndUpdate(
                                            updateCourseDTO.id,
                                            { $set : fieldsToUpdate },
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
