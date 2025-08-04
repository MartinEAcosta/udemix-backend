import { Router } from "express";
import { FileUploadController } from "./file-upload-controller";
import { FileUploadDatasourceImpl } from "../../infraestructure/datasources/file-upload-datasource-impl";
import { FileUploadRepositoryImpl } from "../../infraestructure/repositories/file-upload-repository-impl";
import { IdGenerator } from "../../domain/services/IdGenerator";
import { UuidAdapter } from "../../config/adapters/uuid.adapter";


export class FileUploadRouter {


    static get routes( ){

        const router = Router();

        const datasource = new FileUploadDatasourceImpl();
        const fileUploadRepository = new FileUploadRepositoryImpl( datasource );
        const idGenerator = new UuidAdapter();
        const fileUploadController = new FileUploadController( fileUploadRepository , idGenerator );


        router.post( 
            '/single/:type',
            fileUploadController.uploadFile
        );

        router.post(
            '/multiple/:type',
            fileUploadController.uploadMultipleFiles
        );


        return router;
    }
}