import { NextFunction, Request, Response } from "express";
import { CourseQueryBuilder, CourseQueryFilter } from "../../domain/helpers/course-query-builder";
import { regularExps } from "../../config";

export interface CourseFilterRequest extends Request {
    courseQuery ?: CourseQueryFilter;
}

export class CourseMiddleware {
    
    private readonly courseQueryBuilder : CourseQueryBuilder = new CourseQueryBuilder();

    constructor( ) { }

    validateQueryParams = ( req : CourseFilterRequest , res : Response , next : NextFunction ) => {

        const { category , priceMin , priceMax , title , notFullyEnrolled } = req.query;

        if( priceMin && priceMax ) {
            if( !isNaN( Number(priceMin) ) && !isNaN( Number(priceMax) ) ) {
                this.courseQueryBuilder.withPriceRange( Number(priceMin) , Number(priceMax) );
            }
        }
        else{
            if( priceMin && !isNaN( Number( priceMin ) ) ){
                this.courseQueryBuilder.withPriceRange( Number(priceMin) );
            }
            if( priceMax && !isNaN( Number( priceMax ) ) ){
                this.courseQueryBuilder.withPriceRange( undefined , Number(priceMax) );
            }
        }
        
        if( category && regularExps.isValidId.test( String(category) ) ) {
            this.courseQueryBuilder.withCategoryId( String(category) );
        }

        if( title && typeof title === 'string' && title.trim().length > 0 ) {
            this.courseQueryBuilder.withTitle( title );
        }

        if( notFullyEnrolled && ( String( notFullyEnrolled ) === 'true' || String( notFullyEnrolled ) === 'false' ) ) {
            // Se pasa una expresión por lo tanto es valido.
            this.courseQueryBuilder.withNotFullyEnrolled( String( notFullyEnrolled ) === 'true' );
        }

        req.courseQuery = this.courseQueryBuilder.getQuery();
        next();
    }



}