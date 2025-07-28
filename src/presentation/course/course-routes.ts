import { AuthRepositoryImpl } from './../../infraestructure/repositories/auth-repository-impl';
import { CourseController } from './course-controller';
import { CourseRepositoryImpl } from '../../infraestructure/repositories/course-repository-impl';
import { Router } from "express";
import { CourseDatasourceImpl } from "../../infraestructure/datasources/course-datasource-impl";
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { AuthDatasourceImpl } from '../../infraestructure/datasources/auth-datasource-impl';
import { JwtAdapter } from '../../config/jwt.adapter';


export class CourseRouter {

    static get routes() : Router {

        const router = Router();

        const dataSource = new CourseDatasourceImpl();
        const courseRepository = new CourseRepositoryImpl( dataSource );
        const courseController = new CourseController( courseRepository );

        // ¿Necesario para el middleware?
        const jwtAdapter = new JwtAdapter();
        const authDatasource = new AuthDatasourceImpl();
        const authRepository = new AuthRepositoryImpl( authDatasource );
        const authMiddleware = new AuthMiddleware( jwtAdapter , authRepository );
        
        // GetAll Courses
        router.get(
          '/',
          courseController.getAllCourses
        );
        
        router.get(
          '/:id',
          // [
          //   check( 'id' , 'El id no puede estar vació.' ).notEmpty(),
          // ],
          courseController.getCourseById
        );
        
        // Create Course
        router.post(
          '/new',
          authMiddleware.validateJWT,
          courseController.saveCourse
        );
        
        // Edit Course 
        router.put(
          '/update/:id',
          authMiddleware.validateJWT,
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