import { Router } from "express";

import { DependencyContainer } from "../dependency-container";

export class FileRouter {


    static get routes( ){

        const router = Router();

        const { fileMiddleware , fileController } = DependencyContainer.getInstance();

        router.post( 
            '/upload/single/:folder/:id_entity',
            [ fileMiddleware.containFiles ],
            fileController.uploadFile
        );

        router.post(
            '/multiple/:folder',
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