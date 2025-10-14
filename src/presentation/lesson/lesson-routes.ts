import { Router } from "express";
import { LessonDatasourceImpl } from "../../infraestructure/datasources/lesson-datasource-impl";
import { LessonRepositoryImpl } from "../../infraestructure/repositories/lesson-repository-impl";
import { LessonController } from "./lesson-controller";
import { CourseDatasourceImpl } from "../../infraestructure/datasources/course-datasource-impl";
import { CourseRepositoryImpl } from "../../infraestructure/repositories/course-repository-impl";
import { JwtAdapter } from "../../config";
import { AuthDatasourceImpl } from "../../infraestructure/datasources/auth-datasource-impl";
import { AuthRepositoryImpl } from "../../infraestructure/repositories/auth-repository-impl";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { FileUploadMiddleware } from "../middlewares/file-upload.middleware";
import { FileUploadDatasourceImpl } from "../../infraestructure/datasources/file-upload-datasource-impl";
import { FileUploadRepositoryImpl } from "../../infraestructure/repositories/file-upload-repository-impl";
import { CloudinaryAdapter } from "../../config/adapters/cloudinary.adapter";
import { ModuleDatasourceImpl } from "../../infraestructure/datasources/module-datasource-impl";
import { ModuleRepositoryImpl } from "../../infraestructure/repositories/module-repository-impl";
import { MongooseUnitOfWork } from '../../data/mongoose-unit-of-work';

export class LessonRouter {

    static get routes() : Router {

        const router = Router();
        const mongoUnitOfWork = new MongooseUnitOfWork();

        const datasource = new LessonDatasourceImpl();
        const lessonRepository =  new LessonRepositoryImpl( datasource );

        const courseDatasource = new CourseDatasourceImpl();
        const courseRepository = new CourseRepositoryImpl( courseDatasource);

        const fileStorage = new CloudinaryAdapter();

        const fileDatasource = new FileUploadDatasourceImpl( fileStorage );
        const fileRepository = new FileUploadRepositoryImpl( fileDatasource );

        const moduleDatasource = new ModuleDatasourceImpl( );
        const moduleRepository = new ModuleRepositoryImpl( moduleDatasource );
        
        const lessonController = new LessonController( lessonRepository , moduleRepository , courseRepository , fileRepository , mongoUnitOfWork);

        const jwtAdapter = new JwtAdapter();
        const authDatasource = new AuthDatasourceImpl();
        const authRepository = new AuthRepositoryImpl( authDatasource );
        const authMiddleware = new AuthMiddleware( jwtAdapter , authRepository );

        const fileUploadMiddleware = new FileUploadMiddleware();

        router.post(
            '/new',
            [
                authMiddleware.validateJWT,
                fileUploadMiddleware.containFiles,
                fileUploadMiddleware.fileUploadPreprocessor
            ],
            lessonController.createLesson
        );

        router.post(
            '/update/:id',
            [
                authMiddleware.validateJWT,
                fileUploadMiddleware.containFiles,
                fileUploadMiddleware.fileUploadPreprocessor
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