import { Response } from "express";
import { CustomError } from "../../domain/errors/custom-error";
import { EmailValidator } from "../../domain/services/EmailValidator";
import { HandlerResponses } from "../helpers/handler-responses";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { TokenManager } from "../../domain/services/TokenManager";
import { SendEmailValidationLink } from "../../domain/use-cases/auth/send-email-validation-link";


export class EmailController {

    constructor(
        private readonly emailValidator : EmailValidator,
        private readonly tokenManager   : TokenManager,
    ) {}

    public validateEmail = ( req : AuthenticatedRequest , res : Response ) => {

        const email = req.user?.email;
        console.log(req.user)
        if( !email ) return HandlerResponses.handleError( CustomError.unauthorized('Necesitas estar autenticado para validar tu email.') , res );

        new SendEmailValidationLink( this.emailValidator , this.tokenManager )
            .execute( email )
            .then( emailResponse => HandlerResponses.handleSuccess( res , { send : emailResponse } , 200 ) )
            .catch( error => HandlerResponses.handleError(error,res) );  
    }

}