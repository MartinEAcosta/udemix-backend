import { Router } from "express";

import { CategoryController } from "./category-controller";
import { CategoryDataSourceImpl } from "../../infraestructure/datasources/category-datasource-impl";
import { CategoryRepositoryImpl } from "../../infraestructure/repositories/category-repository-impl";
import { JwtAdapter } from "../../config";
import { AuthDatasourceImpl } from "../../infraestructure/datasources/auth-datasource-impl";
import { AuthRepositoryImpl } from "../../infraestructure/repositories/auth-repository-impl";
import { AuthMiddleware } from "../middlewares/auth.middleware";


export class CategoryRouter {

    static get routes() : Router {

        const router = Router();

        const datasource = new CategoryDataSourceImpl();
        const categoryRepository = new CategoryRepositoryImpl( datasource );
        const categoryController = new CategoryController( categoryRepository );

        const jwtAdapter = new JwtAdapter();
        const authDatasource = new AuthDatasourceImpl();
        const authRepository = new AuthRepositoryImpl( authDatasource );
        const authMiddleware = new AuthMiddleware( jwtAdapter , authRepository );

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