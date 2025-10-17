import { Router } from "express";

import { DependencyContainer } from "../dependency-container";


export class CategoryRouter {

    static get routes() : Router {

        const router = Router();

        const { categoryController, authMiddleware } = DependencyContainer.getInstance();

        router.get( 
            '/',
            categoryController.findAllCategories,
        );

        router.delete(
            '/:id',
            [ authMiddleware.validateJWT ],
            categoryController.deleteCategory
        )

        router.post(
            '/new',
            [ authMiddleware.validateJWT ],
            categoryController.createCategory
        )

        return router;
    }
}