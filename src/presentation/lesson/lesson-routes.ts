import { Router } from "express";
import { LessonDatasourceImpl } from "../../infraestructure/datasources/lesson-datasource-impl";
import { LessonRepositoryImpl } from "../../infraestructure/repositories/lesson-repository-impl";
import { LessonController } from "./lesson-controller";

export class LessonRouter {

    static get routes() : Router {

        const router = Router();

        const datasource = new LessonDatasourceImpl();
        const lessonRepository =  new LessonRepositoryImpl( datasource );
        const lessonController = new LessonController( lessonRepository );

        router.post(
            '/new',
            lessonController.createLesson
        );

        router.delete(
            '/:id',
            lessonController.deleteLesson
        )

        router.get(
            '/:course_id',
            lessonController.findAllLessonsFromCourse
        );

        router.get(
            '/:id',
            lessonController.findLessonById
        )
    
        return router;
    }
}