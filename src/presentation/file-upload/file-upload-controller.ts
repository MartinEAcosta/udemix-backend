import { Request, Response } from "express";
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";

import { FileUploadRepository } from "../../domain/repository/file-upload-repository";
import { UploadSingle } from "../../domain/use-cases/file-upload/upload-single";
import { UploadFileDto } from "../../domain/dtos/file-upload/file-upload.dto";
import { DeleteFile } from "../../domain/use-cases/file-upload/delete-file";
// toLowerCase aplicado a la hora de comparar.
export const validFolders = [ 'user' , 'courses' ];

export class FileUploadController {

    constructor( private readonly fileUploadRepository : FileUploadRepository ) { }

    uploadFile = ( req : Request , res : Response ) => {
        // Propiedad creada automaticamente por el middleware file-upload.
        // req.files;
        // El middleware ya se encargo de validar que haya un archivo existente.
        const file = req.body.files.at(0);
        if( !file ) return HandlerResponses.handleError( CustomError.badRequest('Error inesperado al leer el archivo') , res );
        const [ error , fileToUploadDto] = UploadFileDto.create( {
            size      : file.size,
            data      : file.data,
            mimetype  : file.mimetype,
        });
        
        if( error ) {
            return res.status(400).json({
                error : error,
            });
        }
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

    deleteFile = ( req : Request , res : Response )  => {
        const { public_id } = req.query;
        
        if (!public_id || Array.isArray(public_id) || typeof public_id !== 'string') {
            return res.status(400).json({ error: 'Debe proporcionar un public_id válido' });
        }
        new DeleteFile( this.fileUploadRepository )
            .execute( public_id )
            .then( success => HandlerResponses.handleSuccess( res , success , 200 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }
}