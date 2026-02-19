import { NextFunction, Request, Response } from "express";
import { CourseQueryBuilder, CourseQueryFilter } from "../../domain/helpers/course-query-builder";
import { regularExps } from "../../config";

export interface CourseFilterRequest extends Request {
    courseQuery ?: CourseQueryFilter;
}

export class CourseMiddleware {
    
    constructor( ) { }

    validateQueryParams = ( req : CourseFilterRequest , res : Response , next : NextFunction ) => {

        const query = req.query || {};
        const builder = new CourseQueryBuilder();

        if( Object.keys(query).length === 0 ) return next();

        const { id_category , priceMin , priceMax , title , notFullyEnrolled } = req.query;

        if( priceMin && priceMax ) {
            if( !isNaN( Number(priceMin) ) && !isNaN( Number(priceMax) ) ) {
                builder.withPriceRange( Number(priceMin) , Number(priceMax) );
            }
        }
        else{
            if( priceMin && !isNaN( Number( priceMin ) ) ){
                builder.withPriceRange( Number(priceMin) );
            }
            if( priceMax && !isNaN( Number( priceMax ) ) ){
                builder.withPriceRange( undefined , Number(priceMax) );
            }
        }
        
        if( id_category && regularExps.isValidId.test( String(id_category) ) ) {
            builder.withCategoryId( String(id_category) );
        }

        if( title && typeof title === 'string' && title.trim().length > 0 ) {
            builder.withTitle( title );
        }

        if( notFullyEnrolled && ( String( notFullyEnrolled ) === 'true' || String( notFullyEnrolled ) === 'false' ) ) {
            // Se pasa una expresión por lo tanto es valido.
            builder.withNotFullyEnrolled( String( notFullyEnrolled ) === 'true' );
        }

        req.courseQuery = builder.getQuery();
        next();
    }

}