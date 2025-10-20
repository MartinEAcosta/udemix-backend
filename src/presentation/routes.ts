import { Router } from "express";
import { AuthRouter } from "./auth/auth-routes";
import { CategoryRouter } from "./category/category-routes";
import { CourseRouter } from "./course/course-routes";
import { EnrollmentRouter } from "./enrollment/enrollment-routes";
import { FileRouter } from "./file/file-upload-routes";
import { LessonRouter } from "./lesson/lesson-routes";
import { ModuleRouter } from "./module/module.routes";

export class AppRoutes {

    static get routes() : Router {

        const router = Router();
        
        router.use( '/api/auth' , AuthRouter.routes  ) ;
        router.use( '/api/categories' , CategoryRouter.routes );
        router.use( '/api/courses' , CourseRouter.routes );
        router.use( '/api/enrollments' , EnrollmentRouter.routes );
        router.use( '/api/file' , FileRouter.routes );
        router.use( '/api/lessons' , LessonRouter.routes );
        router.use( '/api/modules' , ModuleRouter.routes );

        return router;
    }
}
