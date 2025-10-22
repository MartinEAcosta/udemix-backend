import { Router } from "express";

import { DependencyContainer } from "../dependency-container";

export class ModuleRouter {

    static get routes() {
        const router = Router();

        const { moduleController , authMiddleware } = DependencyContainer.getInstance();

        router.get(
            '/',
            [ authMiddleware.validateJWT , authMiddleware.validatePermissions(['admin']) ],
            moduleController.findAllModules
        );

        router.get(
            '/:id',
            [ authMiddleware.validateJWT ],
            moduleController.findModuleById
        );

        router.get(
            '/course/:id_course',
            moduleController.findModulesByCourseId
        );
        
        router.get(
            '/course/detailed/:id_course',
            moduleController.findModulesByCourseIdPopulated
        );

        router.post(
            '/new',
            [ authMiddleware.validateJWT ],
            moduleController.createModule
        );

        router.post(
            '/update/:id',
            [ authMiddleware.validateJWT ],
            moduleController.updateModule
        )
        
        router.delete(
            '/delete/:id',
            [ authMiddleware.validateJWT ],
            moduleController.deleteModule
        );


        return router
    }

}