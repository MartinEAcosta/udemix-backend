import { Request, Response } from "express";
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";

import { FileUploadRepository } from "../../domain/repository/file-upload-repository";
import { UploadSingle } from "../../domain/use-cases/file-upload/upload-single";
import { UploadFileDto } from "../../domain/dtos/file-upload/file-upload.dto";
import { DeleteFile } from "../../domain/use-cases/file-upload/delete-file";
import { GetFileById } from "../../domain/use-cases/file-upload/get-file-by-id";
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
        if( !folder ) return;
        
        new UploadSingle( this.fileUploadRepository )
        .execute( fileToUploadDto! , folder! )
        .then( success => HandlerResponses.handleSuccess( res , success , 201 ))
        .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }
    
    uploadMultipleFiles = ( req : Request , res : Response ) => {
        //TODO : devtalles    
    }

    obtainFolder = ( req : Request , res : Response ) : string | undefined => {
        // TODO : ¿podria llegar a ser delegado a un middleware?
        const { folder } = req.params;
        if( !validFolders.includes( folder.toLowerCase() ) ){
            HandlerResponses.handleError( CustomError.notFound(`La carpeta ${folder} no es valida`), res );
            return;
        }

        return folder;
    }

    deleteFile = ( req : Request , res : Response )  => {
        console.log('entre');
        const { public_id } = req.params;
        const folder = this.obtainFolder(req , res);
        
        if( !folder ) return;
        if( !public_id ) return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id valido.') , res );

        new DeleteFile( this.fileUploadRepository )
            .execute( folder, public_id )
            .then( success => HandlerResponses.handleSuccess( res , success , 200 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

    getFileById = ( req : Request , res : Response ) => {
        const { id } = req.params;
        if( !id ) return;

        new GetFileById( this.fileUploadRepository )
            .execute( id )
            .then( success => HandlerResponses.handleSuccess( res , success , 200 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }
}