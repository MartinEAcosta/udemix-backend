import { Router } from "express";
import { AuthDatasourceImpl } from "../../infraestructure/datasources/auth-datasource-impl";
import { AuthRepositoryImpl } from "../../infraestructure/repositories/auth-repository-impl";
import { AuthController } from "./auth-controller";


export class AuthRouter {

        static get routes() : Router {
    
            const router = Router();
    
            const dataSource = new AuthDatasourceImpl();
            const authRepository = new AuthRepositoryImpl( dataSource );
            const authController = new AuthController( authRepository );
            
            router.post(
              '/new',
              authController.registerUser
            );

            // router.post(
            //     '/',
            //     authController.
            // );

            // router.get(
            //     '/renew',
            //     authController.
            // );
        
            return router;
        }
}