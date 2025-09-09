import { Router } from "express";
import { AuthRouter } from "./auth/auth-routes";
import { CategoryRouter } from "./category/category-routes";
import { CourseRouter } from "./course/course-routes";
import { EnrollmentRouter } from "./enrollment/enrollment-routes";
import { FileUploadRouter } from "./file-upload/file-upload-routes";
import { LessonRouter } from "./lesson/lesson-routes";

export class AppRoutes {

    static get routes() : Router {

        const router = Router();
        
        router.use( '/api/auth' , AuthRouter.routes  ) ;
        router.use( '/api/categories' , CategoryRouter.routes );
        router.use( '/api/courses' , CourseRouter.routes );
        router.use( '/api/enrollment' , EnrollmentRouter.routes );
        router.use( '/api/file' , FileUploadRouter.routes );
        router.use( '/api/lessons' , LessonRouter.routes );

        return router;
    }
}
