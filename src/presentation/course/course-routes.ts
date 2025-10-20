import { Router } from "express";

import { DependencyContainer } from "../dependency-container";


export class CourseRouter {

    static get routes() : Router {

        const router = Router();

        const { courseMiddleware, courseController, paginationMiddleware, authMiddleware, fileMiddleware } = DependencyContainer.getInstance();

        // GetAll Courses
        router.get(
          '/',
          [ courseMiddleware.validateQueryParams ],
          courseController.findAllCourses
        );

        router.get(
          '/bulk',
          courseController.findCoursesByIds
        );
        
        router.get(
          '/paginated',
          [ paginationMiddleware.containPageOrLimit ],
          courseController.findCoursesPaginated
        );

        router.get(
          '/:id',
          courseController.findCourseById
        );

        router.get(
          '/category/:slug',
          courseController.findCoursesByCategory
        );
        
        // Create Course
        router.post(
          '/new',
          [
            authMiddleware.validateJWT , authMiddleware.validatePermissions(['teacher', 'admin']) ,
            authMiddleware.validateAndAssignOwner, 
            fileMiddleware.containFiles , fileMiddleware.fileUploadPreprocessor 
          ],
          courseController.saveCourse
        );
        
        // Edit Course 
        router.put(
          '/update/:id',
          [ authMiddleware.validateJWT , authMiddleware.validateAndAssignOwner,
            fileMiddleware.containFiles , fileMiddleware.fileUploadPreprocessor ],
          courseController.updateCourse
        );
        
        // Delete Course
        router.delete(
          '/delete/:id',
          authMiddleware.validateJWT,
          courseController.deleteCourse
        );

        return router;
    }
}