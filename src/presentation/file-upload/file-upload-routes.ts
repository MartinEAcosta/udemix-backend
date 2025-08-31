import { Router } from "express";
import { FileUploadController } from "./file-upload-controller";
import { FileUploadDatasourceImpl } from "../../infraestructure/datasources/file-upload-datasource-impl";
import { FileUploadRepositoryImpl } from "../../infraestructure/repositories/file-upload-repository-impl";
import { CloudinaryAdapter } from "../../config/adapters/cloudinary.adapter";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";


export class FileUploadRouter {


    static get routes( ){

        const router = Router();

        const fileStorage = new CloudinaryAdapter();
        const datasource = new FileUploadDatasourceImpl( fileStorage );
        const fileUploadRepository = new FileUploadRepositoryImpl( datasource );
        const fileUploadController = new FileUploadController( fileUploadRepository );

        const fileUploadMiddleware = new FileUploadMiddleware();

        router.post( 
            '/upload/single/:folder/:id_course',
            fileUploadMiddleware.containFiles,
            fileUploadController.uploadFile
        );

        router.post(
            '/multiple/:folder',
            fileUploadMiddleware.containFiles,
            fileUploadController.uploadMultipleFiles
        );

        router.delete(
            '/delete/:public_id',
            fileUploadController.deleteFile
        );


        return router;
    }
}