import { Router } from "express";

import { JwtAdapter } from '../../config/';
import { CourseController } from './course-controller';
import { CategoryDataSourceImpl } from "../../infraestructure/datasources/category-datasource-impl";
import { CategoryRepositoryImpl } from '../../infraestructure/repositories/category-repository-impl';
import { CourseDatasourceImpl } from "../../infraestructure/datasources/course-datasource-impl";
import { CourseRepositoryImpl } from '../../infraestructure/repositories/course-repository-impl';
import { AuthDatasourceImpl } from '../../infraestructure/datasources/auth-datasource-impl';
import { AuthRepositoryImpl } from './../../infraestructure/repositories/auth-repository-impl';
import { FileUploadDatasourceImpl } from '../../infraestructure/datasources/file-upload-datasource-impl';
import { FileUploadRepositoryImpl } from '../../infraestructure/repositories/file-upload-repository-impl';
import { CloudinaryAdapter } from "../../config/adapters/cloudinary.adapter";
import { AuthMiddleware, FileMiddleware , PaginationMiddleware, CourseMiddleware } from "../middlewares";
import { CourseQueryBuilder } from "../../domain/helpers/course-query-builder";
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