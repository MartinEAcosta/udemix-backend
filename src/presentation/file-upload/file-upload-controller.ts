import { ResourceValidTypes, validTypes } from './../../domain/entities/file.entity';
import { Request, Response } from "express";
import { FileUploadRepository } from "../../domain/repository/file-upload-repository";
import { HandlerResponses } from "../helpers/handler-responses";
import { FileEntity } from "../../domain/entities/file.entity";
import { UploadSingle } from "../../domain/use-cases/file-upload/upload-single";
import { IdGenerator } from "../../domain/services/IdGenerator";
import { CustomError } from "../../domain/errors/custom-error";

// toLowerCase aplicado a la hora de comparar.
export const validExtensions = [ 'jpg' , 'jpeg', 'png' ];
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

        const folder = this.obtainFolder( req , res );

        const uploadedFile = new FileEntity({
            name: `${ this.idGenerator.generateId() }}`,
            size: file.size,
            data: file.data as Buffer,
            type: file.mimetype.split('/')[0].toLowerCase(), // 'image' or 'video'
            format: file.mimetype.split('/')[1].toLowerCase() as ResourceValidTypes,
        });
        console.log(uploadedFile);

        new UploadSingle( this.fileUploadRepository )
            .execute( uploadedFile , folder! )
            .then( success => HandlerResponses.handleSuccess( res , success , 201 ))
            .catch( error => { console.log(error); HandlerResponses.handleError( error , res )});

    }

    obtainFolder = ( req : Request , res : Response ) : string | undefined => {
        
        const { folder } = req.params;
        if( !validFolders.includes( folder.toLowerCase() ) ){
            HandlerResponses.handleError( CustomError.badRequest(`La carpeta ${folder} no es valida`), res );
            return;
        }

        return folder;
    }

    uploadMultipleFiles = ( req : Request , res : Response ) => {
        
    }

}