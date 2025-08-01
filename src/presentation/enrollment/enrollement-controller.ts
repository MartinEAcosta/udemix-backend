import { Request, Response } from "express";
import { EnrollmentRepository } from "../../domain/repository/enrollment.repository";
import { CreateEnrollmentDto } from "../../domain/dtos/enrollment/create-enrollment.dto";
import { HandlerResponses } from "../helpers/handler-responses";
import { SaveEnrollment } from "../../domain/use-cases/enrollment/save-enrollment";
import { AuthenticathedRequest } from "../middlewares/auth.middleware";



export class EnrollmentController{
    
    constructor( private readonly enrollmentRepository : EnrollmentRepository ){}

    saveEnrollment = ( req : AuthenticathedRequest , res : Response ) => {
        const { user } = req;
        if( !user ) res.status(401).json({ error: 'Debes iniciar sesión para inscribirte en un curso.'});
        
        const options = req.body;
        options.id_user = user!.id;
        options.purchaseDate = new Date();
        options.progress = 0;
        options.completionDate = null;
        console.log(options);
        const [ errorMessage , createEnrollmentDto ] = CreateEnrollmentDto.create( options );
        if( errorMessage ) return res.status(400).json({ error : errorMessage });

        new SaveEnrollment( this.enrollmentRepository )
            .execute( createEnrollmentDto! )
            .then( enrollmentCreated => HandlerResponses.handleSuccess( res , enrollmentCreated ) )
            .catch( error => HandlerResponses.handleError( error , res ) );

    }

}