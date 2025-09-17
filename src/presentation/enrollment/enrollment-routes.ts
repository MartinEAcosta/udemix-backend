import { Router } from 'express';
import { EnrollmentDatasourceImpl } from './../../infraestructure/datasources/enrollment-datasource-impl';
import { EnrollmentRepositoryImpl } from '../../infraestructure/repositories/enrollment-repository-impl';
import { EnrollmentController } from './enrollment-controller';
import { AuthDatasourceImpl } from '../../infraestructure/datasources/auth-datasource-impl';
import { AuthRepositoryImpl } from './../../infraestructure/repositories/auth-repository-impl';
import { CourseDatasourceImpl } from '../../infraestructure/datasources/course-datasource-impl';
import { CourseRepositoryImpl } from '../../infraestructure/repositories/course-repository-impl';

import { AuthMiddleware } from '../middlewares/auth.middleware';
import { JwtAdapter } from '../../config';


export class EnrollmentRouter { 

    static get routes() : Router {

        const router = Router();

        const enrollmentDatasource = new EnrollmentDatasourceImpl();
        const enrollmentRepository = new EnrollmentRepositoryImpl( enrollmentDatasource );
        
        // ¿Necesario para el middleware?
        const jwtAdapter = new JwtAdapter();
        const authDatasource = new AuthDatasourceImpl( );
        const authRepository = new AuthRepositoryImpl( authDatasource );
        const authMiddleware = new AuthMiddleware( jwtAdapter , authRepository );

        const courseDatasource = new CourseDatasourceImpl();
        const courseRepository = new CourseRepositoryImpl( courseDatasource );

        const enrollmentController = new EnrollmentController( enrollmentRepository, authRepository, courseRepository );
        

        router.get(
            '/',
            enrollmentController.findAllEnrollments
        );

        router.get(
            '/:id_user',
            enrollmentController.findEnrollmentsByUserId
        );


        router.post(
            '/new',
            [ authMiddleware.validateJWT ],
            enrollmentController.enrollUserInCourse
        );
        

        return router;
    }

}