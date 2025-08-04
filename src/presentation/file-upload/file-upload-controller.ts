import { Request, Response } from "express";
import { FileUploadRepository } from "../../domain/repository/file-upload-repository";
import { HandlerResponses } from "../helpers/handler-responses";
import { FileEntity } from "../../domain/entities/file.entity";
import { UploadSingle } from "../../domain/use-cases/file-upload/upload-single";
import { IdGenerator } from "../../domain/services/IdGenerator";

export const validExtensions = ['jpg' , 'jpeg', 'png' ];

export class FileUploadController {

    constructor( private readonly fileUploadRepository : FileUploadRepository,
                 private readonly idGenerator : IdGenerator,
     ) { }

    uploadFile = ( req : Request , res : Response ) => {
        // Propiedad creada automaticamente por el middleware file-upload.
        const files = req.files;
        if( !req.files || Object.keys(req.files).length === 0 ) {
            return res.status(400).json({ error: 'No se han seleccionado archivos.' });
        }

        const uploadedFile = Array.isArray(files!.file) ? files!.file[0] : files!.file;
        const type = uploadedFile.mimetype.split('/')[1] || '';
        if( !validExtensions.includes(type) ){
            throw res.status(400).json({ error: `La extensión ${type} no es válida. Las extensiones permitidas son: ${ validExtensions }` });
        }
        
        const file = new FileEntity({
            name: `${ this.idGenerator.generateId() }.${ type }`,
            size: uploadedFile.size,
            data: uploadedFile.data as Buffer,
            type: type,
        });
        console.log(file);
        new UploadSingle( this.fileUploadRepository )
            .execute( file )
            .then( success => HandlerResponses.handleSuccess( res , success , 201 ))
            .catch( error => HandlerResponses.handleError( res , error ));


    }

    uploadMultipleFiles = ( req : Request , res : Response ) => {
        
    }

}