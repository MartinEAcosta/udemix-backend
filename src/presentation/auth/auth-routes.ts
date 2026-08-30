import { Router } from "express";

import { DependencyContainer } from "../dependency-container";


export class AuthRouter {

        static get routes() : Router {
    
            const router = Router();
    
            const { authController, authMiddleware, emailController } = DependencyContainer.getInstance();
            
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

            // Evitar el get porque el clasico prefetch de la página puede hacer que se ejecute 
            // el endpoint sin que el usuario lo desee. Mejor usar un post con un boton de validación.
            router.post(
                '/send-validation-email',
                [authMiddleware.validateJWT],
                emailController.sendValidationEmail,
            );

            router.post(
                '/validate-email/:token',
                emailController.validateEmail
            );

            return router;
        }
}