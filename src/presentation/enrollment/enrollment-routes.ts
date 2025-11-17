import { Router } from 'express';

import { DependencyContainer } from '../dependency-container';


export class EnrollmentRouter { 

    static get routes() : Router {

        const router = Router();

        const { enrollmentController, authMiddleware } = DependencyContainer.getInstance();

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
        

        router.post(
            '/mark-lesson-completed',
            [ authMiddleware.validateJWT ],
            enrollmentController.markLessonAsCompleted
        );

        return router;
    }

}