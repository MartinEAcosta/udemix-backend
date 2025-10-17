import { Router } from "express";

import { DependencyContainer } from "../dependency-container";


export class FileUploadRouter {


    static get routes( ){

        const router = Router();

        const { fileMiddleware , fileController ,   } = DependencyContainer.getInstance();

        router.post( 
            '/upload/single/:folder',
            [ fileMiddleware.requireFiles , fileMiddleware.fileUploadPreprocessor ],
            fileController.uploadFile
        );

        router.post(
            '/multiple/:folder',
            [ fileMiddleware.requireFiles , fileMiddleware.fileUploadPreprocessor ],
            fileController.uploadMultipleFiles
        );

        router.delete(
            '/:id',
            fileController.deleteFile
        );
        
        router.delete(
            '/course-thumbnail/:course_id',
            fileController.deleteCourseThumbnail,
        );
        
        router.get( 
            '/:id',
            fileController.findFileById,
        )


        return router;
    }
}