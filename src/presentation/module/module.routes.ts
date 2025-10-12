import { Router } from "express";
import { ModuleDatasourceImpl } from "../../infraestructure/datasources/module-datasource-impl";
import { ModuleRepositoryImpl } from "../../infraestructure/repositories/module-repository-impl";
import { CourseDatasourceImpl } from "../../infraestructure/datasources/course-datasource-impl";
import { CourseRepositoryImpl } from "../../infraestructure/repositories/course-repository-impl";
import { ModuleController } from "./module.controller";
import { JwtAdapter } from "../../config";
import { AuthDatasourceImpl } from "../../infraestructure/datasources/auth-datasource-impl";
import { AuthRepositoryImpl } from "../../infraestructure/repositories/auth-repository-impl";
import { AuthMiddleware } from "../middlewares";

export class ModuleRouter {

    static get routes() {
        const router = Router();

        const datasource = new ModuleDatasourceImpl();
        const moduleRepository = new ModuleRepositoryImpl( datasource );

        const courseDatasource = new CourseDatasourceImpl();
        const courseRepository = new CourseRepositoryImpl( courseDatasource );

        const moduleController = new ModuleController( moduleRepository , courseRepository );

        const jwtAdapter = new JwtAdapter();
        const authDatasource = new AuthDatasourceImpl();
        const authRepository = new AuthRepositoryImpl( authDatasource );
        const authMiddleware = new AuthMiddleware( jwtAdapter , authRepository );



        router.post(
            '/new',
            [ authMiddleware.validateJWT ],
            moduleController.createModule
        );

        return router
    }

}