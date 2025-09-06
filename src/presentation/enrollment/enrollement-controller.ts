import { Request, Response } from "express";
import { EnrollmentRepository } from "../../domain/repository/enrollment.repository";
import { CreateEnrollmentDto } from "../../domain/dtos/enrollment/create-enrollment.dto";
import { HandlerResponses } from "../helpers/handler-responses";
import { EnrollUserInCourse } from "../../domain/use-cases/enrollment/enroll-user-in-course";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { CustomError } from "../../domain/errors/custom-error";
import { AuthRepository } from "../../domain/repository/auth-repository";
import { CourseRepository } from "../../domain/repository/course-repository";



export class EnrollmentController{
    
    constructor( 
        private readonly enrollmentRepository : EnrollmentRepository,
        private readonly authRepository       : AuthRepository,
        private readonly courseRepository     : CourseRepository,
    ) { }

    // saveEnrollment
    public enrollUserInCourse = ( req : AuthenticatedRequest , res : Response ) => {

        const user = req.user;
        if( !user ) return HandlerResponses.handleError( CustomError.unauthorized('El usuario debe estar autenticado para adquirir un curso.') , res );
        
        const { course_id } = req.body;
        const [ errorMessage , createEnrollmentDto ] = CreateEnrollmentDto.create( 
                                                                                    { 
                                                                                        id_user   : user.id ,
                                                                                        id_course :  course_id,
                                                                                    } 
                                                                                );
        if( errorMessage ) return res.status(400).json( { error : errorMessage });

        new EnrollUserInCourse( this.enrollmentRepository, this.authRepository , this.courseRepository )
            .execute( createEnrollmentDto! )
            .then( enrollmentCreated => HandlerResponses.handleSuccess( res , enrollmentCreated ) )
            .catch( error => HandlerResponses.handleError( error , res ) );

    }

    
}