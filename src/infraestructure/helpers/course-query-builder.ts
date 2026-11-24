import { FilterQuery, Types } from "mongoose";

import { CourseFilterDto } from "../../domain/dtos/course/course-filter.dto";
import { ICourseModel } from "../../data/mongo/models/course.model";

//* Mongoose filters :
//* $gte : mayor o igual que
//* $lte : menor o igual que
//* $regex : contiene 'string', $options : 'i' no importan las mayus o minusculas

/** Escapa los metacaracteres para que el texto del usuario no se interprete como regex. */
const escapeRegex = ( value : string ) => value.replace( /[.*+?^${}()|[\]\\]/g , '\\$&' );

/**
 * Traduce un CourseFilterDto (intención) a una query de Mongo.
 * Vive en infraestructura porque conoce la sintaxis de la base de datos.
 */
export class CourseQueryBuilder {

    private query : FilterQuery<ICourseModel>;

    constructor( ) {
        this.query = {};
    }

    public withCategoryId( id_category ?: string ) {
        if( id_category ){
            // Casteo explícito: .find() auto-castea el string a ObjectId, pero .aggregate() no,
            // y un $match con el id como string no matchea ningún documento.
            // El formato ya lo validó CourseFilterDto.create con regularExps.isValidId.
            this.query.id_category = new Types.ObjectId( id_category );
        }
        return this;
    }

    public withTitle( title ?: string ) {
        if( title ){
            this.query.title = { $regex : escapeRegex( title ) , $options : 'i' };
        }
        return this;
    }

    public withPriceRange( priceMin ?: number , priceMax ?: number ) {
        if( priceMin != null || priceMax != null ){
            const price : { $gte ?: number , $lte ?: number } = {};
            if( priceMin != null ) price.$gte = priceMin;
            if( priceMax != null ) price.$lte = priceMax;
            this.query.price = price;
        }
        return this;
    }

    public withNotFullyEnrolled( notFullyEnrolled ?: boolean ) {
        if( notFullyEnrolled ){
            // Un curso sin capacity tiene cupo ilimitado, por lo tanto nunca está completo.
            this.query.$or = [
                { capacity : { $exists : false } },
                { capacity : null },
                { $expr : { $lt : [ "$current_enrolled" , "$capacity" ] } },
            ];
        }
        return this;
    }

    public getQuery( ) : FilterQuery<ICourseModel> {
        return this.query;
    }

    static fromFilter = ( filter : CourseFilterDto ) : FilterQuery<ICourseModel> => {
        return new CourseQueryBuilder()
                        .withCategoryId( filter.id_category )
                        .withTitle( filter.title )
                        .withPriceRange( filter.priceMin , filter.priceMax )
                        .withNotFullyEnrolled( filter.notFullyEnrolled )
                        .getQuery();
    }
}
