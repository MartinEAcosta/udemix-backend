import { Router } from "express";
import { CourseRouter } from "./course/course-routes";

export class AppRoutes {

    static get routes() : Router {

        const router = Router();

        router.use( '/api/courses' , CourseRouter.routes );
        // router.use( '/api/auth' , authRoutes  ) ;
        // router.use( '/api/upload' , fileUploadRouter );

        return router;
    }
}
