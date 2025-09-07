import { Router } from "express";

import { CategoryDataSourceImpl } from "../../infraestructure/datasources/category-datasource-impl";
import { CategoryRepositoryImpl } from "../../infraestructure/repositories/category-repository";
import { CategoryController } from "./category-controller";


export class CategoryRouter {

    static get routes() : Router {

        const router = Router();

        const datasource = new CategoryDataSourceImpl();
        const categoryRepository = new CategoryRepositoryImpl( datasource );
        const categoryController = new CategoryController( categoryRepository );

        router.get( 
            '/',
            categoryController.findAllCategories,
        );

        router.post(
            '/new',
            categoryController.createCategory
        )

        return router;
    }
}