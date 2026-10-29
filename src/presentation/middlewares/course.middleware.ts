import { NextFunction, Response } from "express";

import { CourseFilterDto } from "../../domain/dtos/course/course-filter.dto";
import { CustomError } from "../../domain/errors/custom-error";
import { HandlerResponses } from "../helpers/handler-responses";
import { PaginatedRequest } from "./pagination.middleware";

export interface CourseFilterRequest extends PaginatedRequest {
    courseFilter ?: CourseFilterDto;
}

export class CourseMiddleware {
    
    constructor( ) { }

    validateQueryParams = ( req : CourseFilterRequest , res : Response , next : NextFunction ) => {

        const [ error , courseFilterDto ] = CourseFilterDto.create( req.query );
        if( error ) return HandlerResponses.handleError( CustomError.badRequest( error ) , res );

        // Siempre se asigna: sin query params el filtro queda vacío, no undefined.
        req.courseFilter = courseFilterDto;

        next();
    }

}
