import { Request, Response } from "express";
import { FileUploadRepository } from "../../domain/repository/file-upload-repository";
import { HandlerResponses } from "../helpers/handler-responses";
import { FileEntity } from "../../domain/entities/file.entity";
import { UploadSingle } from "../../domain/use-cases/file-upload/upload-single";
import { IdGenerator } from "../../domain/services/IdGenerator";

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
        console.log(file);

        const { folder } = req.params;
        if( !validFolders.includes(folder) ){
            return res.status(400).json({ error: `El parametro ${folder} no es válido.` });
        }

        const uploadedFile = new FileEntity({
            name: `${ this.idGenerator.generateId() }}`,
            size: file.size,
            data: file.data as Buffer,
            type: file.mimetype,
        });
        console.log(file);

        new UploadSingle( this.fileUploadRepository )
            .execute( uploadedFile , folder )
            .then( success => HandlerResponses.handleSuccess( res , success , 201 ))
            .catch( error => HandlerResponses.handleError( res , error ));


    }

    uploadMultipleFiles = ( req : Request , res : Response ) => {
        
    }

}