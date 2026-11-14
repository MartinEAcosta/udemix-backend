import { CustomError } from "../../errors/custom-error";
import { buildForgotPasswordHtml } from "../../helpers/email-templates";
import { regularExps } from "../../helpers/regular.exp";
import { AuthRepository } from "../../repository";
import { MailerService, TokenManager } from "../../services";

interface ForgotPasswordUseCase {
    execute ( email : string ) : Promise<boolean>;
}

export class ForgotPassword implements ForgotPasswordUseCase {

    constructor(
        private readonly authRepository : AuthRepository,
        private readonly mailerService  : MailerService,
        private readonly tokenManager   : TokenManager, 
    ) {}

    async execute ( email : string ) : Promise<boolean> {
        if( !regularExps.email.test( email ) ) throw CustomError.badRequest('El email no tiene un formato valido.');
        const user = await this.authRepository.findUserByEmail( email );
        if( !user ) return true;

        const token = await this.tokenManager.generateToken({ email , duration: '15m' });
        if( !token ) throw CustomError.internalServer('Hubo un error al generar el token.');

        const link = `${ this.mailerService.baseURL }/auth/forgot-password/${token}`;
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