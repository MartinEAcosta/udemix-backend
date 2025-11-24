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
import { UnitOfWork } from "../../domain/services/UnitOfWork";
import { MarkLessonAsCompleted } from "../../domain/use-cases/enrollment/mark-lesson-as-completed";
import { LessonRepository, ModuleRepository } from "../../domain/repository";
import { FindSpecificEnrollment } from "../../domain/use-cases/enrollment/find-specific-enrollment";


export class EnrollmentController{
    
    constructor( 
        private readonly enrollmentRepository : EnrollmentRepository,
        private readonly authRepository       : AuthRepository,
        private readonly courseRepository     : CourseRepository,
        private readonly lessonRepository     : LessonRepository,
        private readonly moduleRepository     : ModuleRepository,
        private readonly unitOfWork           : UnitOfWork,
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
        if( !id_user ) return HandlerResponses.handleError(CustomError.badRequest('Debes indicar un id usuario válido.'), res);

        new FindEnrollmentsByUserId( this.enrollmentRepository )
            .execute( id_user )
            .then( enrollments => HandlerResponses.handleSuccess( res , enrollments , 200 ) )
            .catch( error => HandlerResponses.handleError( error , res ) );
    }

    public findEnrollmentByUserIdAndCourseId = ( req : AuthenticatedRequest , res : Response ) => {
        
        const { user } = req;
        if( !user ) return HandlerResponses.handleError( CustomError.unauthorized('El usuario debe encontrarse autenticado para obtener una inscripción en especifica.') , res );
        
        const { id_user , id_course } = req.params;
        if( !id_user ) return HandlerResponses.handleError( CustomError.badRequest( 'Debes indicar el id del usuario al que buscas la inscripción.') , res );
        if( !id_course ) return HandlerResponses.handleError( CustomError.badRequest( 'Debes indicar el id del curso al que buscas la inscripción.') , res );
        console.log( id_user , user.id )
        if( id_user != user.id ) return HandlerResponses.handleError( CustomError.unauthorized( 'No puedes buscar una inscripción que no te pertenece') , res );

        new FindSpecificEnrollment( this.enrollmentRepository , this.authRepository , this.courseRepository )
            .execute( id_user , id_course )        
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
        if( errorMessage ) return HandlerResponses.handleError(CustomError.badRequest(errorMessage), res);

        new EnrollUserInCourse( this.enrollmentRepository, this.authRepository , this.courseRepository , this.unitOfWork )
            .execute( createEnrollmentDto! )
            .then( enrollmentCreated => HandlerResponses.handleSuccess( res , enrollmentCreated, 201 ) )
            .catch( error => HandlerResponses.handleError( error , res ) );
    }

    public markLessonAsCompleted = ( req : AuthenticatedRequest , res : Response ) => {

        const { user } = req;
        if( !user ) return HandlerResponses.handleError( CustomError.unauthorized('Debes estar autenticado para marcar una lección como completada.') , res );
        if( !req.body?.id_course || !req.body?.id_lesson ) return HandlerResponses.handleError( CustomError.badRequest('Chequee los campos id_course e id_lesson y vuelve a intentarlo.') , res );
        const { id_course , id_lesson } = req.body;

        new MarkLessonAsCompleted( this.enrollmentRepository , this.courseRepository , this.lessonRepository , 
                                    this.moduleRepository , this.authRepository )
            .execute( id_course , id_lesson , user!.id )
            .then( enrollment => HandlerResponses.handleSuccess( res , enrollment, 200 ) )
            .catch( error => HandlerResponses.handleError( error , res ) );
    }


    
}