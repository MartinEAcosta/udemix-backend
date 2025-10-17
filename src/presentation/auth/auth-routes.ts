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

            router.get(
                '/send-validation-email',
                [authMiddleware.validateJWT],
                emailController.sendValidationEmail,
            );

            router.get(
                '/validate-email/:token',
                emailController.validateEmail
            )

            return router;
        }
}