import { CourseController } from './course-controller';
import { CourseRepositoryImpl } from '../../infraestructure/repositories/course-repository-impl';
import { Router } from "express";
import { CourseDatasourceImpl } from "../../infraestructure/datasources/course-datasource-impl";


export class CourseRouter {

    static get routes() : Router {

        const router = Router();

        const dataSource = new CourseDatasourceImpl();
        const courseRepository = new CourseRepositoryImpl( dataSource );
        const courseController = new CourseController( courseRepository );
        
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
          // [
          //   check( 'title', 'El titulo no puede estar vació.' ).notEmpty(),
          //   check( 'description', 'La descripción no puede estar vacia.' ).notEmpty(),
          //   check( 'owner', 'El propietario no puede estar vacio.' ).notEmpty(),
          //   validateFields,
          //   validateJWT,
          // ],
          courseController.saveCourse
        );
        
        // Edit Course 
        router.put(
          '/update/:id',
          // [
          //   check( 'title', 'El titulo no puede estar vació.' ).notEmpty(),
          //   check( 'description', 'La descripción no puede estar vacia.' ).notEmpty(),
          //   check( 'owner', 'El propietario no puede estar vacio.' ).notEmpty(),
          //   validateFields,
          //   validateJWT,
          // ],
          courseController.updateCourse
        );
        
        // // Delete Course
        router.delete(
          '/delete/:id',
          // validateJWT,
          courseController.deleteCourse
        );

        return router;
    }
}