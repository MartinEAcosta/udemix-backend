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
                fileMiddleware.containFiles,
            ],
            lessonController.createLesson
        );

        router.post(
            '/update/:id',
            [
                authMiddleware.validateJWT,
                fileMiddleware.containFiles,
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
        
    
        return router;
    }
}