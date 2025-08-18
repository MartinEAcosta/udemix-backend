import { AuthRepositoryImpl } from './../../infraestructure/repositories/auth-repository-impl';
import { Router } from 'express';
import { EnrollmentDatasourceImpl } from './../../infraestructure/datasources/enrollment-datasource-impl';
import { EnrollmentRepositoryImpl } from '../../infraestructure/repositories/enrollment-repository-impl';
import { EnrollmentController } from './enrollement-controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { JwtAdapter } from '../../config';
import { AuthDatasourceImpl } from '../../infraestructure/datasources/auth-datasource-impl';


export class EnrollmentRouter { 

    static get routes() : Router {

        const router = Router();

        const datasource = new EnrollmentDatasourceImpl();
        const enrollmentRepository = new EnrollmentRepositoryImpl( datasource );
        const enrollmentController = new EnrollmentController( enrollmentRepository );
        
        // ¿Necesario para el middleware?
        const jwtAdapter = new JwtAdapter();
        const authDatasource = new AuthDatasourceImpl( );
        const authRepository = new AuthRepositoryImpl( authDatasource );
        const authMiddleware = new AuthMiddleware( jwtAdapter , authRepository );
        

        router.post(
            '/new',
            [ authMiddleware.validateJWT ],
            enrollmentController.saveEnrollment
        );
        

        return router;
    }

}