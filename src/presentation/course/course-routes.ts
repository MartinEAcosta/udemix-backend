import { Router } from "express";

import { DependencyContainer } from "../dependency-container";


export class CourseRouter {

    static get routes() : Router {

        const router = Router();

        const { courseController, authMiddleware } = DependencyContainer.getInstance();

        // Listado con filtros (id_category, category_name, title, priceMin, priceMax,
        // notFullyEnrolled) y paginación (current_page, limit) por query string.
        router.get(
          '/',
          courseController.findAllCourses
        );

        router.get(
          '/bulk',
          courseController.findCoursesByIds
        );

        router.get(
          '/:id',
          courseController.findCourseById
        );

        // Create Course
        router.post(
          '/new',
          [
            authMiddleware.validateJWT , 
            authMiddleware.validatePermissions(['teacher', 'admin']) ,
            authMiddleware.validateAndAssignOwner, 
          ],
          courseController.saveCourse
        );
        
        // Edit Course
        router.put(
          '/update/:id',
          [
            authMiddleware.validateJWT ,
            authMiddleware.validatePermissions(['teacher', 'admin']) ,
          ],
          courseController.updateCourse
        );

        // Delete Course
        router.delete(
          '/delete/:id',
          [
            authMiddleware.validateJWT,
            authMiddleware.validatePermissions(['teacher', 'admin']),
          ],
          courseController.deleteCourse
        );

        return router;
    }
}