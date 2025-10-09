import { NextFunction, Request, Response } from "express";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";


export class PaginationMiddleware {

    containPageOrLimit = ( req : Request , res : Response , next : NextFunction ) => {

        const { page = 1 , limit = 10 } = req.query;

        const [ error , paginationDto ] = PaginationDto.create( +page , +limit );
        if( error ) HandlerResponses.handleError( CustomError.badRequest( error ) , res );

        req.body = req.body || {};
        req.body.pagination = paginationDto;

        next();
    }

}