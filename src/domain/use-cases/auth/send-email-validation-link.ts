import crypto from "crypto";

import { CustomError } from "../../errors/custom-error";
import { AuthRepository } from "../../repository/auth-repository";
import { SingleUseTokenRepository } from "../../repository/single-use-token-repository";
import { MailerService } from "../../services/MailerService";
import { TokenManager } from "../../services/TokenManager";
import { regularExps } from '../../helpers/regular.exp';
import { buildEmailValidationHtml } from '../../helpers/email-templates';

interface SendEmailValidationLinkUseCase {
    execute( email : string ) : Promise<boolean>;
}

const EMAIL_VALIDATION_DURATION = '2h';

export class SendEmailValidationLink implements SendEmailValidationLinkUseCase {

    constructor(
        private readonly authRepository : AuthRepository,
        private readonly mailerService : MailerService,
        private readonly tokenManager   : TokenManager,
        private readonly singleUseTokenRepository : SingleUseTokenRepository,
    ){ }

    async execute( email : string ) : Promise<boolean> {

        if( !regularExps.email.test( email ) ) throw CustomError.badRequest('El email no tiene un formato valido.');
        const user = await this.authRepository.findUserByEmail( email );
        if( !user ) throw CustomError.notFound('No se encontro un usuario vinculado a ese email.');
        if( user.isEmailVerified ) throw CustomError.badRequest('El email del usuario ya se encuentra verificado.');

        const jti = crypto.randomUUID();
        const expiresAt = new Date( Date.now() + 2 * 60 * 60 * 1000 );
        await this.singleUseTokenRepository.create( user.id , jti , 'email_verification' , expiresAt );

        const token = await this.tokenManager.generateToken( {email , jti} , EMAIL_VALIDATION_DURATION );
        if( !token ) throw CustomError.internalServer('Hubo un error al generar el token.');

        const link = `${ this.mailerService.baseURL }/auth/verify-email/${ token }`;
        const html = buildEmailValidationHtml( { email, link } );

        const options = {
            to : email ,
            subject : 'Valida tu email - Udemix',
            htmlBody : html,
        }; 

        const isSent = await this.mailerService.sendEmail( options );
        if( !isSent ) throw CustomError.internalServer('Hubo un error inesperado al enviar el correo.');

        console.log(isSent);
        return true;
    }
    
}