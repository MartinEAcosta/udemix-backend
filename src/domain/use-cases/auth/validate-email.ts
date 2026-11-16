import { CustomError } from '../../errors/custom-error';
import { UpdateUserDto } from '../../dtos/auth/update-user-dto';
import { AuthRepository } from '../../repository/auth-repository';
import { SingleUseTokenRepository } from '../../repository/single-use-token-repository';
import { TokenManager } from '../../services/TokenManager';

interface ValidateEmailUseCase {
    execute ( token : string ) : Promise<boolean>;
}

export class ValidateEmail implements ValidateEmailUseCase {


    constructor(
        private readonly authRepository : AuthRepository,
        private readonly tokenManager   : TokenManager,
        private readonly singleUseTokenRepository : SingleUseTokenRepository,
    ) { }


    async execute( token: string ) : Promise<boolean> {

        const payload = await this.tokenManager.validateToken<{ email : string , jti : string }>( token );
        if( !payload ) throw CustomError.unauthorized('El token no es valido o ya fue utilizado.');

        const { email, jti } = payload;
        if( !email || !jti ) throw CustomError.unauthorized('El token no es valido o ya fue utilizado.');

        const singleUseToken = await this.singleUseTokenRepository.findValidByJti( jti , 'email_verification' );
        if( !singleUseToken ) throw CustomError.unauthorized('El token no es valido o ya fue utilizado.');

        const user = await this.authRepository.findUserByEmail( email );
        if( !user ) throw CustomError.badRequest('No se ha encontrado un usuario vinculado a ese email.');

        if( user.isEmailVerified ) throw CustomError.badRequest('El email del usuario ya se encuentra verificado.');

        const updatedUser = await this.authRepository.updateUser(
            UpdateUserDto.markEmailVerified( user.id , true )
        );
        if( !updatedUser ) throw CustomError.internalServer('Hubo un error inesperado al actualizar el usuario');

        await this.singleUseTokenRepository.consume( singleUseToken.id );

        return true;
    }

}