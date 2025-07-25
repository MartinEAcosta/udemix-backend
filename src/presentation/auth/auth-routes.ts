import { Router } from "express";
import { AuthDatasourceImpl } from "../../infraestructure/datasources/auth-datasource-impl";
import { AuthRepositoryImpl } from "../../infraestructure/repositories/auth-repository-impl";
import { AuthController } from "./auth-controller";
import { Encrypter } from "../../domain/services/Encrypter";
import { BcryptAdapter } from "../../config/bcrypt.adapter";
import { JwtAdapter } from "../../config/jwt.adapter";


export class AuthRouter {

        static get routes() : Router {
    
            const router = Router();
    
            const dataSource = new AuthDatasourceImpl();
            const authRepository = new AuthRepositoryImpl( dataSource );
            const encrypter = new BcryptAdapter();
            const tokenManager = new JwtAdapter();
            const authController = new AuthController( authRepository , encrypter , tokenManager );
            
            router.post(
              '/new',
              authController.registerUser
            );

            router.post(
                '/',
                authController.loginUser
            );

            // router.get(
            //     '/renew',
            //     authController.
            // );
        
            return router;
        }
}