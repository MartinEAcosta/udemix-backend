import { Response } from "express";
import { CustomError } from "../../domain/errors/custom-error";
import { EmailValidator } from "../../domain/services/EmailValidator";
import { HandlerResponses } from "../helpers/handler-responses";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { TokenManager } from "../../domain/services/TokenManager";
import { SendEmailValidationLink } from "../../domain/use-cases/auth/send-email-validation-link";
import { ValidateEmail } from "../../domain/use-cases/auth/validate-email";
import { AuthRepository } from "../../domain/repository/auth-repository";


export class EmailController {

    constructor(
        private readonly authRepository : AuthRepository,
        private readonly emailValidator : EmailValidator,
        private readonly tokenManager   : TokenManager,
    ) {}

    public sendValidationEmail = ( req : AuthenticatedRequest , res : Response ) => {

        const email = req.user?.email;
        console.log(req.user)
        if( !email ) return HandlerResponses.handleError( CustomError.unauthorized('Necesitas estar autenticado para validar tu email.') , res );

        new SendEmailValidationLink( this.emailValidator , this.tokenManager )
            .execute( email )
            .then( emailResponse => HandlerResponses.handleSuccess( res , { send : emailResponse } , 200 ) )
            .catch( error => HandlerResponses.handleError(error,res) );  
    }

    public validateEmail = ( req : AuthenticatedRequest , res : Response ) => {

        const { token } = req.params;

        new ValidateEmail( this.authRepository , this.tokenManager )
            .execute( token )
            .then( response => HandlerResponses.handleSuccess( res , { verified : response } , 200 ) )
            .catch( error => HandlerResponses.handleError(error,res) );  
    }
}