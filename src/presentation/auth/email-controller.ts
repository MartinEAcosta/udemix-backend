import { Response } from "express";
import { CustomError } from "../../domain/errors/custom-error";
import { MailerService } from "../../domain/services/MailerService";
import { HandlerResponses } from "../helpers/handler-responses";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { TokenManager } from "../../domain/services/TokenManager";
import { SendEmailValidationLink } from "../../domain/use-cases/auth/send-email-validation-link";
import { ValidateEmail } from "../../domain/use-cases/auth/validate-email";
import { AuthRepository } from "../../domain/repository/auth-repository";
import { SingleUseTokenRepository } from "../../domain/repository/single-use-token-repository";


export class EmailController {

    constructor(
        private readonly authRepository : AuthRepository,
        private readonly mailerService : MailerService,
        private readonly tokenManager   : TokenManager,
        private readonly singleUseTokenRepository : SingleUseTokenRepository,
    ) {}

    public sendValidationEmail = ( req : AuthenticatedRequest , res : Response ) => {

        const email = req.user?.email;
        if( !email ) return HandlerResponses.handleError( CustomError.unauthorized('Necesitas estar autenticado para validar tu email.') , res );

        new SendEmailValidationLink( this.authRepository, this.mailerService , this.tokenManager , this.singleUseTokenRepository )
            .execute( email )
            .then( emailResponse => HandlerResponses.handleSuccess( res , { send : emailResponse } , 200 ) )
            .catch( error => HandlerResponses.handleError(error,res) );
    }

    public validateEmail = ( req : AuthenticatedRequest , res : Response ) => {
        if (typeof req.params.token !== 'string' || !req.params.token) {
            return HandlerResponses.handleError(
                CustomError.badRequest('Token inválido'), res
            );
        }
        const { token } = req.params;

        new ValidateEmail( this.authRepository , this.tokenManager , this.singleUseTokenRepository )
            .execute( token )
            .then( response => HandlerResponses.handleSuccess( res , { verified : response } , 200 ) )
            .catch( error => HandlerResponses.handleError(error,res) );
    }

}