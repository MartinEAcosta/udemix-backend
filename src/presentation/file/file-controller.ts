import { Request, Response } from "express";
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";
import { FileRepository } from "../../domain/repository/file-repository";
import { CourseRepository } from "../../domain/repository/course-repository";

import { UploadSingle } from "../../domain/use-cases/file/upload-single";
import { DeleteFile } from "../../domain/use-cases/file/delete-file";
import { FindFileById } from "../../domain/use-cases/file/find-file-by-id";
import { DeleteCourseThumbnail } from "../../domain/use-cases/file/delete-course-thumbnail";

// toLowerCase aplicado a la hora de comparar.
export const validFolders = [ 'user' , 'courses' , "lessons" ];

export class FileController {

    constructor( 
        private readonly fileRepository : FileRepository, 
        private readonly courseRepository : CourseRepository 
    ) { }

    public uploadFile = ( req : Request , res : Response ) => {
        // Propiedad creada automaticamente por el middleware file-upload.
        // req.files;
        // El middleware ya se encargo de validar que haya un archivo existente.
        // const file = req.body.files.at(0);
        // if( !file ) return HandlerResponses.handleError( CustomError.badRequest('Error inesperado al leer el archivo') , res );
        // const [ error , fileToUploadDto] = UploadFileDto.create( {
        //     size      : file.size,
        //     data      : file.data,
        //     mimetype  : file.mimetype,
        // });
        // if( error ) return HandlerResponses.handleError( CustomError.badRequest( error ), res );

        const { fileToUploadDto } = req.body.attachedFile;
        if( !fileToUploadDto ) return HandlerResponses.handleError( CustomError.badRequest('No se pudo recopilar el archivo.') , res );
        
        const folder = this.obtainFolder( req , res );
        if( !folder ) return;
        
        new UploadSingle( this.fileRepository )
            .execute( fileToUploadDto! , folder! )
            .then( success => HandlerResponses.handleSuccess( res , success , 201 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }
    
    public uploadMultipleFiles = ( req : Request , res : Response ) => {
        //TODO : devtalles    
    }

    public obtainFolder = ( req : Request , res : Response ) : string | undefined => {
        // TODO : ¿podria llegar a ser delegado a un middleware?
        const { folder } = req.params;
        if( !validFolders.includes( folder.toLowerCase() ) ){
            HandlerResponses.handleError( CustomError.notFound(`La carpeta ${folder} no es valida`), res );
            return;
        }

        return folder;
    }

    public deleteFile = ( req : Request , res : Response )  => {

        const { id } = req.params;
        if( !id ) return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id valido.') , res );

        new DeleteFile( this.fileRepository )
            .execute( id )
            .then( success => HandlerResponses.handleSuccess( res , success , 200 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

    public deleteCourseThumbnail = ( req : Request , res : Response ) => {
        const { course_id } = req.params;
        if( !course_id ) return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id valido.') , res );

        new DeleteCourseThumbnail( this.fileRepository , this.courseRepository )
            .execute( course_id )
            .then( success => HandlerResponses.handleSuccess( res , success , 200 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

    public findFileById = ( req : Request , res : Response ) => {
        const { id } = req.params;
        if( !id ) return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id valido.') , res );

        new FindFileById( this.fileRepository )
            .execute( id )
            .then( success => HandlerResponses.handleSuccess( res , success , 200 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }
}