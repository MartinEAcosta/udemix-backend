import { Router } from "express";

import { DependencyContainer } from "../dependency-container";

export class FileRouter {


    static get routes( ){

        const router = Router();

        const { fileMiddleware , fileController , authMiddleware } = DependencyContainer.getInstance();

        router.post( 
            '/upload/single/:folder/:id_entity',
            [ 
                fileMiddleware.containFiles,
                authMiddleware.validateJWT,
            ],
            fileController.uploadFile
        );

        router.post(
            '/multiple/:folder',
            fileController.uploadMultipleFiles
        );

        router.delete(
            '/:folder/:id_entity',
            [
                authMiddleware.validateJWT
            ],
            fileController.deleteFile
        );

        router.delete(
            '/course-thumbnail/:course_id',
            [
                authMiddleware.validateJWT
            ],
            fileController.deleteCourseThumbnail,
        );

        router.get(
            '/:id',
            [
                authMiddleware.validateJWT
            ],
            fileController.findFileById,
        )


        return router;
    }
}