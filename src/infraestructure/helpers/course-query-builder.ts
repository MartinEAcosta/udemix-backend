import { FilterQuery, Types } from "mongoose";

import { CourseFilterDto } from "../../domain/dtos/course/course-filter.dto";
import { ICourseModel } from "../../data/mongo/models/course.model";

/** Escapa los metacaracteres para que el texto del usuario no se interprete como regex. */
const escapeRegex = ( value : string ) => value.replace( /[.*+?^${}()|[\]\\]/g , '\\$&' );

/**
 * Traduce un CourseFilterDto (intención) a una query de Mongo.
 * Vive en infraestructura porque conoce la sintaxis de la base de datos.
 * Los valores ya vienen validados y normalizados por CourseFilterDto.create.
 */
export const buildCourseQuery = ( filter : CourseFilterDto ) : FilterQuery<ICourseModel> => {
    const query : FilterQuery<ICourseModel> = {};

    if( filter.id_category ){
        // Casteo explícito: .find() auto-castea el string a ObjectId, pero .aggregate() no,
        // y un $match con el id como string no matchea ningún documento.
        query.id_category = new Types.ObjectId( filter.id_category );
    }

    if( filter.category_name ){
        // Match exacto (anclado) pero sin distinguir mayúsculas: 'programación' encuentra 'Programación'.
        query.category_name = { $regex : `^${ escapeRegex( filter.category_name ) }$` , $options : 'i' };
    }

    if( filter.title ){
        // Contiene el texto, sin distinguir mayúsculas.
        query.title = { $regex : escapeRegex( filter.title ) , $options : 'i' };
    }

    if( filter.priceMin !== undefined || filter.priceMax !== undefined ){
        query.price = {
            ...( filter.priceMin !== undefined && { $gte : filter.priceMin } ),
            ...( filter.priceMax !== undefined && { $lte : filter.priceMax } ),
        };
    }

    if( filter.notFullyEnrolled ){
        // Un curso sin capacity tiene cupo ilimitado, por lo tanto nunca está completo.
        query.$or = [
            { capacity : { $exists : false } },
            { capacity : null },
            { $expr : { $lt : [ "$current_enrolled" , "$capacity" ] } },
        ];
    }

    return query;
}
