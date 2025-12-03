import { Router } from "express";

import { DependencyContainer } from "../dependency-container";

export class LessonRouter {

    static get routes() : Router {

        const router = Router();

        const { lessonController , authMiddleware , fileMiddleware } = DependencyContainer.getInstance();

        router.post(
            '/new',
            [
                authMiddleware.validateJWT,
            ],
            lessonController.createLesson
        );

        router.put(
            '/update/:id',
            [
                authMiddleware.validateJWT,
            ],
            lessonController.updateLesson
        );

        router.delete(
            '/delete/:id',
            [authMiddleware.validateJWT ],
            lessonController.deleteLesson
        )

        // * CHEQUEAR QUE ES EL MISMO QUE EL DETAILED
        router.get(
            '/course/:course_id',
            lessonController.findAllLessonsFromCourse
        );

        router.get(
            '/detailed/course/:course_id',
            lessonController.findAllLessonsFromCourse
        );

        router.get(
            '/:id',
            lessonController.findLessonById
        );
        
        router.get(
            '/next/:id_enrollment',
            [ authMiddleware.validateJWT ],
            lessonController.findNextLesson
        );

    
        return router;
    }
}