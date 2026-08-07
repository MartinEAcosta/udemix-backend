import { Request, Response } from "express";
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";
import { FileRepository } from "../../domain/repository/file-repository";
import { CourseRepository } from "../../domain/repository/course-repository";

import { UploadSingle } from "../../domain/use-cases/file/upload-single";
import { DeleteFile } from "../../domain/use-cases/file/delete-file";
import { FindFileById } from "../../domain/use-cases/file/find-file-by-id";
import { DeleteCourseThumbnail } from "../../domain/use-cases/file/delete-course-thumbnail";
import { UploadFileDto } from "../../domain/dtos/file/file.dto";
import { LessonRepository } from "../../domain/repository";

// toLowerCase aplicado a la hora de comparar.
export const validFolders = [ 'user' , 'courses' , "lessons" ];

export class FileController {

    constructor( 
        private readonly fileRepository : FileRepository, 
        private readonly courseRepository : CourseRepository,
        private readonly lessonRepository : LessonRepository
    ) { }

    public uploadFile = ( req : Request , res : Response ) => {
        // Propiedad creada automaticamente por el middleware file-upload.
        // req.files;
        // El middleware ya se encargo de validar que haya un archivo existente.

        if( typeof req.params.id_entity !== 'string' || !req.params.id_entity ) {
            return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id valido.') , res );
        }
        const { id_entity } = req.params;

        const file = req.body.files.at(0);
        if( !file ) return HandlerResponses.handleError( CustomError.badRequest('Error inesperado al leer el archivo') , res );
        const [ error , fileToUploadDto] = UploadFileDto.create( {
            size      : file.size,
            data      : file.data,
            mimetype  : file.mimetype,
        });
        if( error ) return HandlerResponses.handleError( CustomError.badRequest( error ), res );

        const folder : 'courses' | 'lessons' | undefined = this.obtainFolder( req , res );
        if( !folder ) return;
        
        new UploadSingle( this.fileRepository , this.courseRepository , this.lessonRepository )
            .execute( fileToUploadDto! , folder , id_entity )
            .then( success => HandlerResponses.handleSuccess( res , success , 201 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }
    
    public uploadMultipleFiles = ( req : Request , res : Response ) => {
        //TODO : devtalles    
    }

    public obtainFolder = ( req : Request , res : Response ) : 'lessons' | 'courses' | undefined => {
        if( typeof req.params.folder !== 'string' || !req.params.folder ) {
            HandlerResponses.handleError( CustomError.badRequest('Debes indicar un folder valido.') , res );
            return;
        }

        const { folder } = req.params;
        const fol = folder.toLowerCase();
        if( !validFolders.includes( fol ) ){
            HandlerResponses.handleError( CustomError.notFound(`La carpeta ${folder} no es valida`), res );
            return;
        }

        return fol as 'lessons' | 'courses';
    }

    public deleteFile = ( req : Request , res : Response )  => {
        if( typeof req.params.id !== 'string' || !req.params.id ) {
            return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id valido.') , res );
        }
        const { id } = req.params;

        new DeleteFile( this.fileRepository )
            .execute( id )
            .then( success => HandlerResponses.handleSuccess( res , success , 200 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

    public deleteCourseThumbnail = ( req : Request , res : Response ) => {
        if( typeof req.params.course_id !== 'string' || !req.params.course_id ) {
            return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id valido.') , res );
        }
        const { course_id } = req.params;

        new DeleteCourseThumbnail( this.fileRepository , this.courseRepository )
            .execute( course_id )
            .then( success => HandlerResponses.handleSuccess( res , success , 200 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

    public findFileById = ( req : Request , res : Response ) => {
        if( typeof req.params.id !== 'string' || !req.params.id ) {
            return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id valido.') , res );
        }
        const { id } = req.params;

        new FindFileById( this.fileRepository )
            .execute( id )
            .then( success => HandlerResponses.handleSuccess( res , success , 200 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }
}