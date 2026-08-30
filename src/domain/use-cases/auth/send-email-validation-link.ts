import { CustomError } from "../../errors/custom-error";
import { AuthRepository } from "../../repository/auth-repository";
import { EmailValidator } from "../../services/EmailValidator";
import { TokenManager } from "../../services/TokenManager";
import { regularExps } from '../../helpers/regular.exp';
import { buildEmailValidationHtml } from '../../helpers/email-templates';

interface SendEmailValidationLinkUseCase {
    execute( email : string ) : Promise<boolean>;
}

export class SendEmailValidationLink implements SendEmailValidationLinkUseCase {

    constructor( 
        private readonly authRepository : AuthRepository,
        private readonly emailValidator : EmailValidator,
        private readonly tokenManager   : TokenManager,
    ){ }

    async execute( email : string ) : Promise<boolean> {

        if( !regularExps.email.test( email ) ) throw CustomError.badRequest('El email no tiene un formato valido.');
        const user = await this.authRepository.findUserByEmail( email );
        if( !user ) throw CustomError.notFound('No se encontro un usuario vinculado a ese email.');
        if( user.isEmailVerified ) throw CustomError.badRequest('El email del usuario ya se encuentra verificado.');

        const token = await this.tokenManager.generateToken( {email} );
        if( !token ) throw CustomError.internalServer('Hubo un error al generar el token.');

        const link = `${ this.emailValidator.baseURL }/auth/verify-email/${ token }`;
        const html = buildEmailValidationHtml( { email, link } );

        const options = {
            to : email ,
            subject : 'Valida tu email - Udemix',
            htmlBody : html,
        }; 

        const isSent = await this.emailValidator.sendEmail( options );
        if( !isSent ) throw CustomError.internalServer('Hubo un error inesperado al enviar el correo.');

        console.log(isSent);
        return true;
    }
    
}