import { NextFunction, Request, Response } from "express";
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";
import { UploadFileDto } from "../../domain/dtos/file-upload/file-upload.dto";

export class FileUploadMiddleware {
    // Utilizado para el estandarizado de respuesta, dado que Clodinary retorna un objeto cuando se sube un solo archivo y 
    // un array cuando se se suben varios arhivos.
    requireFiles = ( req : Request , res: Response , next : NextFunction )  => {
        if (!req.body) req.body = {};

        if( !req.files || Object.keys(req.files).length === 0 ) {
            return HandlerResponses.handleError( CustomError.badRequest('No se han seleccionado archivos.') , res);
        }
        if( !Array.isArray( req.files.file ) ){
            req.body.files = [ req.files.files ];
        }
        else {
            req.body.files = req.files.files;
        }

        next();
    }

    containFiles = ( req : Request , res: Response , next : NextFunction )  => {
        if (!req.body) req.body = {};

        if( !Array.isArray( req.files?.file ) ){
            req.body.files = [ req.files?.files ];
        }
        else {
            req.body.files = req.files.files;
        }

        next();
    }

    fileUploadPreprocessor = ( req : Request , res : Response , next : NextFunction ) => {
        const file = req.body.files.at(0);
        if( file ){
            const [ error , fileToUploadDto] = UploadFileDto.create( {
                size      : file.size,
                data      : file.data,
                mimetype  : file.mimetype,
            });
            if( error ) return HandlerResponses.handleError( CustomError.badRequest( error ), res );
    
            req.body.attachedFile = fileToUploadDto;
        }

        next();
    }


}