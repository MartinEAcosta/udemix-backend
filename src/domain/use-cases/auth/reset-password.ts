import { CustomError } from "../../errors/custom-error";
import { ResetPasswordDto } from "../../dtos/auth/reset-password.dto";
import { AuthRepository, SingleUseTokenRepository } from "../../repository";
import { Encrypter, TokenManager } from "../../services";

interface ResetPasswordUseCase {
    execute ( resetPasswordDto : ResetPasswordDto ) : Promise<boolean>;
}

export class ResetPassword implements ResetPasswordUseCase {

    constructor(
        private readonly authRepository           : AuthRepository,
        private readonly singleUseTokenRepository  : SingleUseTokenRepository,
        private readonly tokenManager              : TokenManager,
        private readonly encrypter                 : Encrypter,
    ) {}

    async execute( resetPasswordDto : ResetPasswordDto ) : Promise<boolean> {
        const payload = await this.tokenManager.validateToken<{ email : string , jti : string }>( resetPasswordDto.token );
        if( !payload ) throw CustomError.unauthorized('El token no es valido o ya fue utilizado.');

        const { email , jti } = payload;
        if( !email || !jti ) throw CustomError.unauthorized('El token no es valido o ya fue utilizado.');

        const singleUseToken = await this.singleUseTokenRepository.findValidByJti( jti , 'password_reset' );
        if( !singleUseToken ) throw CustomError.unauthorized('El token no es valido o ya fue utilizado.');

        const user = await this.authRepository.findUserByEmail( email );
        if( !user ) throw CustomError.notFound('No se ha encontrado un usuario vinculado a ese email.');

        const hashedPassword = await this.encrypter.hash( resetPasswordDto.password );
        await this.authRepository.updateUserPassword( user.id , hashedPassword );

        await this.singleUseTokenRepository.consume( singleUseToken.id );

        return true;
    }

}
