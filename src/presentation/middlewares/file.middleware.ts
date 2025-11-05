import { NextFunction, Request, Response } from "express";
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";
import { UploadFileDto } from "../../domain/dtos/file-upload/file-upload.dto";

export class FileMiddleware {
    // Utilizado para el estandarizado de respuesta, dado que Clodinary retorna un objeto cuando se sube un solo archivo y 
    // un array cuando se se suben varios arhivos.
     containFiles = ( req : Request , res: Response , next : NextFunction )  => {
        if (!req.body) req.body = {};

        // console.log(req.files);

        if( !req.files || Object.keys(req.files).length === 0 ) {
            return res.status(400).json({ error: 'No se han seleccionado archivos.' });
        }
        if( !Array.isArray( req.files.file ) ){
            req.body.files = [ req.files.files ];
        }
        else {
            req.body.files = req.files.files;
        }

        next();
    }


}