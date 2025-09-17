import { Request, Response } from "express";
import { EnrollmentRepository } from "../../domain/repository/enrollment-repository";
import { CreateEnrollmentDto } from "../../domain/dtos/enrollment/create-enrollment.dto";
import { HandlerResponses } from "../helpers/handler-responses";
import { EnrollUserInCourse } from "../../domain/use-cases/enrollment/enroll-user-in-course";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { CustomError } from "../../domain/errors/custom-error";
import { AuthRepository } from "../../domain/repository/auth-repository";
import { CourseRepository } from "../../domain/repository/course-repository";
import { FindAllEnrollments } from "../../domain/use-cases/enrollment/find-all-enrollments";
import { FindEnrollmentsByUserId } from "../../domain/use-cases/enrollment/find-enrollments-by-user-id";



export class EnrollmentController{
    
    constructor( 
        private readonly enrollmentRepository : EnrollmentRepository,
        private readonly authRepository       : AuthRepository,
        private readonly courseRepository     : CourseRepository,
    ) { }

    // Solo permitido por administradores en teoria
    public findAllEnrollments = ( req : AuthenticatedRequest , res : Response ) => {

        new FindAllEnrollments( this.enrollmentRepository )
            .execute()
            .then( enrollments => HandlerResponses.handleSuccess( res , enrollments , 200 ) )
            .catch( error => HandlerResponses.handleError( error , res ) );
    }

    public findEnrollmentsByUserId = ( req : AuthenticatedRequest , res : Response ) => {

        const { id_user } = req.params;
        if( !id_user ) throw HandlerResponses.handleError(CustomError.badRequest('Debes indicar un id usuario válido.'), res);


        new FindEnrollmentsByUserId( this.enrollmentRepository )
            .execute( id_user )
            .then( enrollments => HandlerResponses.handleSuccess( res , enrollments , 200 ) )
            .catch( error => HandlerResponses.handleError( error , res ) );
    }

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
            .then( enrollmentCreated => HandlerResponses.handleSuccess( res , enrollmentCreated, 201 ) )
            .catch( error => HandlerResponses.handleError( error , res ) );

    }

    
}