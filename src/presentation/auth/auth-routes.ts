import { Router } from "express";

import { AuthController } from "./auth-controller";
import { AuthDatasourceImpl } from "../../infraestructure/datasources/auth-datasource-impl";
import { AuthRepositoryImpl } from "../../infraestructure/repositories/auth-repository-impl";
import { CourseRepositoryImpl } from "../../infraestructure/repositories/course-repository-impl";
import { CourseDatasourceImpl } from "../../infraestructure/datasources/course-datasource-impl";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { BcryptAdapter , JwtAdapter } from "../../config/";


export class AuthRouter {

        static get routes() : Router {
    
            const router = Router();
    
            const dataSource = new AuthDatasourceImpl();
            const authRepository = new AuthRepositoryImpl( dataSource );
            const courseDatasource = new CourseDatasourceImpl();
            const courseRepository = new CourseRepositoryImpl( courseDatasource ); 
            const encrypter = new BcryptAdapter();
            const tokenManager = new JwtAdapter();
            const authController = new AuthController( authRepository , courseRepository , encrypter , tokenManager );
            
            // ¿Necesario para el middleware?
            const jwtAdapter = new JwtAdapter();
            const authMiddleware = new AuthMiddleware( jwtAdapter , authRepository );
            
            router.post(
              '/new',
              authController.registerUser
            );

            router.post(
                '/',
                authController.loginUser
            );

            router.get(
                '/renew',
                [authMiddleware.validateJWT],
                authController.reloadToken
            );

            router.post(
                '/course',
                [authMiddleware.validateJWT],
                authController.acquireCourse
            );
        
            return router;
        }
}