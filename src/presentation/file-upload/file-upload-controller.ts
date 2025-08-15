import { Request, Response } from "express";
import { IdGenerator } from "../../domain/services/IdGenerator";
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";

import { FileUploadRepository } from "../../domain/repository/file-upload-repository";
import { UploadSingle } from "../../domain/use-cases/file-upload/upload-single";
import { FileDto } from "../../domain/dtos/file-upload/file.dto";
// toLowerCase aplicado a la hora de comparar.
export const validFolders = [ 'users' , 'courses' ];

export class FileUploadController {

    constructor( private readonly fileUploadRepository : FileUploadRepository,
                 private readonly idGenerator : IdGenerator,
     ) { }

    uploadFile = ( req : Request , res : Response ) => {
        // Propiedad creada automaticamente por el middleware file-upload.
        // req.files;
        // El middleware ya se encargo de validar que haya un archivo existente.
        const file = req.body.files.at(0);
        if( !file ) return HandlerResponses.handleError( CustomError.badRequest('Error inesperado al leer el archivo') , res );

        const [ error , fileToUploadDto] = FileDto.create( {
            filename: this.idGenerator.generateId(),
            size : file.size,
            data : file.data,
            mimetype : file.mimetype,
        });
        if( error ) return res.status(400).json({
            error : error,
        });
        
        const folder = this.obtainFolder( req , res );

        new UploadSingle( this.fileUploadRepository )
            .execute( fileToUploadDto! , folder! )
            .then( success => HandlerResponses.handleSuccess( res , success , 201 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

    obtainFolder = ( req : Request , res : Response ) : string => {
        
        const { folder } = req.params;
        if( !validFolders.includes( folder.toLowerCase() ) ){
            throw HandlerResponses.handleError( CustomError.badRequest(`La carpeta ${folder} no es valida`), res );
        }

        return folder;
    }

    uploadMultipleFiles = ( req : Request , res : Response ) => {
        
    }

}