import { Router } from "express";
import { CourseRouter } from "./course/course-routes";
import { AuthRouter } from "./auth/auth-routes";
import { EnrollmentRouter } from "./enrollment/enrollment-routes";
import { FileUploadRouter } from "./file-upload/file-upload-routes";

export class AppRoutes {

    static get routes() : Router {

        const router = Router();

        router.use( '/api/courses' , CourseRouter.routes );
        router.use( '/api/auth' , AuthRouter.routes  ) ;
        router.use( '/api/enrollment' , EnrollmentRouter.routes );
        router.use( '/api/file' , FileUploadRouter.routes );

        return router;
    }
}
