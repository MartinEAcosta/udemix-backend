import { AuthRepository } from '../../repository/auth-repository';
import { TokenManager } from '../../services/TokenManager';
import { Encrypter } from '../../services/Encrypter';

import { CustomError } from '../../errors/custom-error';
import { RegisterUserDto } from '../../dtos/auth/register-user.dto';
import { AuthSuccessResponseDto } from '../../dtos/auth/auth.responses.dto';

interface RegisterUserUseCase {
    execute( registerUserDto : RegisterUserDto ) : Promise<AuthSuccessResponseDto>;
}

export class RegisterUser implements RegisterUserUseCase {

    constructor(
        private readonly authRepository : AuthRepository,
        private readonly encrypter : Encrypter,
        private readonly tokenManager : TokenManager,
    ){}

    // TODO : CHEQuEAR RESPONSE JWT 
    async execute ( registerUserDto : RegisterUserDto ) : Promise<AuthSuccessResponseDto> {
        
        const userExists = await this.authRepository.findUserByEmail( registerUserDto.email );
        if( userExists ) throw CustomError.badRequest( 'Ya existe una cuenta asociada a este email.' );
    
        const { password , ...rest } = registerUserDto;
        const hashedPassword = this.encrypter.hash( password );

        const newUser = await this.authRepository.registerUser( 
                                                                { 
                                                                    password : hashedPassword, 
                                                                    ...rest 
                                                                } 
                                                            );

        const token = await this.tokenManager.generateToken({ id : newUser.id });
        if( !token ) throw CustomError.internalServer('Error en la creación del token.');

        return {
            user: {
                id       : newUser.id,
                username : newUser.username,
                email    : newUser.email,                                
            },
            token: token,
        }
    }

}