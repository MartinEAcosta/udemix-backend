import { Router } from "express";

import { CourseController } from './course-controller';
import { CategoryDataSourceImpl } from "../../infraestructure/datasources/category-datasource-impl";
import { CategoryRepositoryImpl } from '../../infraestructure/repositories/category-repository-impl';
import { CourseDatasourceImpl } from "../../infraestructure/datasources/course-datasource-impl";
import { CourseRepositoryImpl } from '../../infraestructure/repositories/course-repository-impl';
import { AuthDatasourceImpl } from '../../infraestructure/datasources/auth-datasource-impl';
import { AuthRepositoryImpl } from './../../infraestructure/repositories/auth-repository-impl';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { JwtAdapter } from '../../config/';
import { FileUploadDatasourceImpl } from '../../infraestructure/datasources/file-upload-datasource-impl';
import { FileUploadRepositoryImpl } from '../../infraestructure/repositories/file-upload-repository-impl';
import { CloudinaryAdapter } from "../../config/adapters/cloudinary.adapter";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";


export class CourseRouter {

    static get routes() : Router {

        const router = Router();

        const dataSource = new CourseDatasourceImpl();

        const categoryDatasource = new CategoryDataSourceImpl();
        const categoryRepository = new CategoryRepositoryImpl( categoryDatasource );

        const fileStorage = new CloudinaryAdapter();
        const fileDatasource = new FileUploadDatasourceImpl( fileStorage );
        const fileRepository = new FileUploadRepositoryImpl( fileDatasource );

        const courseRepository = new CourseRepositoryImpl( dataSource );
        const courseController = new CourseController( courseRepository , categoryRepository , fileRepository );

        // ¿Necesario para el middleware?
        const jwtAdapter = new JwtAdapter();
        const authDatasource = new AuthDatasourceImpl();
        const authRepository = new AuthRepositoryImpl( authDatasource );
        const authMiddleware = new AuthMiddleware( jwtAdapter , authRepository );

        const fileMiddleware = new FileUploadMiddleware();
        
        // GetAll Courses
        router.get(
          '/',
          courseController.findAllCourses
        );
        
        router.get(
          '/:id',
          // [
          //   check( 'id' , 'El id no puede estar vació.' ).notEmpty(),
          // ],
          courseController.findCourseById
        );

        router.get(
          '/category/:slug',
          courseController.findCoursesByCategory
        );
        
        // Create Course
        router.post(
          '/new',
          [ authMiddleware.validateJWT , authMiddleware.validateAndAssignOwner, 
            fileMiddleware.containFiles , fileMiddleware.fileUploadPreprocessor ],
          courseController.saveCourse
        );
        
        // Edit Course 
        router.put(
          '/update/:id',
          [ authMiddleware.validateJWT , authMiddleware.validateAndAssignOwner ],
          courseController.updateCourse
        );
        
        // // Delete Course
        router.delete(
          '/delete/:id',
          authMiddleware.validateJWT,
          courseController.deleteCourse
        );

        return router;
    }
}