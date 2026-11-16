import crypto from "crypto";

import { CustomError } from "../../errors/custom-error";
import { buildForgotPasswordHtml } from "../../helpers/email-templates";
import { regularExps } from "../../helpers/regular.exp";
import { AuthRepository, SingleUseTokenRepository } from "../../repository";
import { MailerService, TokenManager } from "../../services";

interface ForgotPasswordUseCase {
    execute ( email : string ) : Promise<boolean>;
}

const RESET_PASSWORD_DURATION = '15m';

export class ForgotPassword implements ForgotPasswordUseCase {

    constructor(
        private readonly authRepository           : AuthRepository,
        private readonly mailerService            : MailerService,
        private readonly tokenManager             : TokenManager,
        private readonly singleUseTokenRepository : SingleUseTokenRepository,
    ) {}

    async execute ( email : string ) : Promise<boolean> {
        if( !regularExps.email.test( email ) ) throw CustomError.badRequest('El email no tiene un formato valido.');
        const user = await this.authRepository.findUserByEmail( email );
        if( !user ) return true;

        const jti = crypto.randomUUID();
        const expiresAt = new Date( Date.now() + 15 * 60 * 1000 );
        await this.singleUseTokenRepository.create( user.id , jti , 'password_reset' , expiresAt );

        const token = await this.tokenManager.generateToken({ email , jti } , RESET_PASSWORD_DURATION );
        if( !token ) throw CustomError.internalServer('Hubo un error al generar el token.');

        const link = `${ this.mailerService.baseURL }/auth/reset-password/${token}`;
        const html = buildForgotPasswordHtml( { email , link } );

        const options = {
            to : email ,
            subject : 'Restablecé tu contraseña de Udemix',
            htmlBody : html,
        };
        const isSent = await this.mailerService.sendEmail( options );
        if( !isSent ) throw CustomError.internalServer('Hubo un error inesperado al enviar el correo.');

        return true;
    }
}