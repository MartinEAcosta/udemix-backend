import { AuthSuccessResponse } from '../../dtos/auth/responses';
import { CustomError } from '../../errors/custom-error';
import { AuthRepository } from '../../repository/auth-repository';
import { Encrypter } from '../../services/Encrypter';
import { TokenManager } from '../../services/TokenManager';
import { RegisterUserDto } from './../../dtos/auth/register-user-dto';

interface RegisterUserUseCase {
    execute( registerUserDto : RegisterUserDto ) : Promise<AuthSuccessResponse>;
}

export class RegisterUser implements RegisterUserUseCase {

    constructor(
        private readonly authRepository : AuthRepository,
        private readonly encrypter : Encrypter,
        private readonly tokenManager : TokenManager,
    ){}

    // TODO : CHEQuEAR RESPONSE JWT 
    async execute ( registerUserDto : RegisterUserDto ) : Promise<AuthSuccessResponse> {
        
        const userExists = await this.authRepository.searchUserByEmail( registerUserDto.email );
        if( userExists ) throw CustomError.badRequest( 'Ya existe una cuenta asociada a este email.' );
    
        const { password , ...rest } = registerUserDto;
        const hashedPassword = this.encrypter.hash( password );

        const newUser = await this.authRepository.registerUser({password : hashedPassword , ...rest });

        const token = await this.tokenManager.generateToken({ id : newUser.id });
        if( !token ) throw CustomError.internalServer('Error en la creación del token.');

        return {
            user: newUser,
            token: token,
        }
    }

}