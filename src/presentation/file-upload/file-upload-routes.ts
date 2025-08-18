import { Router } from "express";
import { FileUploadController } from "./file-upload-controller";
import { FileUploadDatasourceImpl } from "../../infraestructure/datasources/file-upload-datasource-impl";
import { FileUploadRepositoryImpl } from "../../infraestructure/repositories/file-upload-repository-impl";
import { UuidAdapter } from "../../config/adapters/uuid.adapter";
import { CloudinaryAdapter } from "../../config/adapters/cloudinary.adapter";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";


export class FileUploadRouter {


    static get routes( ){

        const router = Router();

        const fileStorage = new CloudinaryAdapter();
        const datasource = new FileUploadDatasourceImpl( fileStorage );
        const fileUploadRepository = new FileUploadRepositoryImpl( datasource );
        const idGenerator = new UuidAdapter();
        const fileUploadController = new FileUploadController( fileUploadRepository , idGenerator );

        const fileUploadMiddleware = new FileUploadMiddleware();

        router.post( 
            '/:folder/:id_course',
            fileUploadMiddleware.containFiles,
            fileUploadController.uploadFile
        );

        router.post(
            '/multiple/:folder',
            fileUploadMiddleware.containFiles,
            fileUploadController.uploadMultipleFiles
        );


        return router;
    }
}