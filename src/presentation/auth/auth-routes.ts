import { Router } from "express";

import { AuthController } from "./auth-controller";
import { AuthDatasourceImpl } from "../../infraestructure/datasources/auth-datasource-impl";
import { AuthRepositoryImpl } from "../../infraestructure/repositories/auth-repository-impl";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { BcryptAdapter , JwtAdapter } from "../../config/";


export class AuthRouter {

        static get routes() : Router {
    
            const router = Router();
    
            const dataSource = new AuthDatasourceImpl();
            const authRepository = new AuthRepositoryImpl( dataSource );
            const encrypter = new BcryptAdapter();
            const tokenManager = new JwtAdapter();
            const authController = new AuthController( authRepository , encrypter , tokenManager );
            
            // ¿Necesario para el middleware?
            const jwtAdapter = new JwtAdapter();
            const authMiddleware = new AuthMiddleware( jwtAdapter , authRepository );
            
            router.post(
              '/register',
              authController.registerUser
            );

            router.post(
                '/login',
                authController.loginUser
            );

            router.get(
                '/renew',
                [authMiddleware.validateJWT],
                authController.reloadToken
            );

            router.get(
                '/validate-email/:token',
                authController.validateEmail
            );

            return router;
        }
}