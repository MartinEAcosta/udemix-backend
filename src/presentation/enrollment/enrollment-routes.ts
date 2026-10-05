import { Router } from 'express';

import { DependencyContainer } from '../dependency-container';

export class EnrollmentRouter { 

    static get routes() : Router {

        const router = Router();

        const { enrollmentController, authMiddleware } = DependencyContainer.getInstance();

        router.get(
            '/',
            [ authMiddleware.validateJWT, authMiddleware.validatePermissions(['admin']) ],
            enrollmentController.findAllEnrollments
        );

        router.get(
            '/:id_enrollment',
            [ authMiddleware.validateJWT ],
            enrollmentController.findEnrollmentPopulatedById
        );

        router.get(
            '/user/:id_user',
            [ authMiddleware.validateJWT ],
            enrollmentController.findEnrollmentsByUserId
        );

        router.get(
            '/user/:id_user/course/:id_course',
            [ authMiddleware.validateJWT ],
            enrollmentController.findEnrollmentByUserIdAndCourseId
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