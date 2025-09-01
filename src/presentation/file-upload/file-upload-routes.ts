import { Router } from "express";
import { FileUploadController } from "./file-upload-controller";
import { FileUploadDatasourceImpl } from "../../infraestructure/datasources/file-upload-datasource-impl";
import { FileUploadRepositoryImpl } from "../../infraestructure/repositories/file-upload-repository-impl";
import { CloudinaryAdapter } from "../../config/adapters/cloudinary.adapter";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";
import { CourseRepositoryImpl } from "../../infraestructure/repositories/course-repository-impl";
import { CourseDatasourceImpl } from "../../infraestructure/datasources/course-datasource-impl";


export class FileUploadRouter {


    static get routes( ){

        const router = Router();

        const fileStorage = new CloudinaryAdapter();
        const fileDatasource = new FileUploadDatasourceImpl( fileStorage );
        const fileUploadRepository = new FileUploadRepositoryImpl( fileDatasource );
        const courseDatasource = new CourseDatasourceImpl();
        const courseRepository = new CourseRepositoryImpl( courseDatasource );
        const fileUploadController = new FileUploadController( fileUploadRepository , courseRepository );

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
            '/:id',
            fileUploadController.deleteFile
        );
        
        router.delete(
            '/course-thumbnail/:course_id',
            fileUploadController.deleteCourseThumbnail
        );
        
        router.get( 
            '/:id',
            fileUploadController.getFileById,
        )


        return router;
    }
}