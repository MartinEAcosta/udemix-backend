import { UserEntity } from '../../entities/user.entity';
import { CustomError } from '../../errors/custom-error';
import { AuthRepository } from '../../repository/auth-repository';
import { Encrypter } from '../../services/Encrypter';
import { RegisterUserDto } from './../../dtos/auth/register-user-dto';

export interface RegisterUserUseCase {
    execute( registerUserDto : RegisterUserDto ) : Promise<UserEntity>;
}

export class RegisterUser {

    constructor(
        private readonly authRepository : AuthRepository,
        private readonly encrypter : Encrypter,
    ){}

    // TODO : CHEQuEAR RESPONSE JWT 
    async execute ( registerUserDto : RegisterUserDto ) : Promise<UserEntity> {
        
        const userExists = await this.authRepository.searchUserByEmail( registerUserDto.email );
        if( userExists ) throw CustomError.badRequest( 'Ya existe una cuenta asociada a este email.' );
    
        const { password , ...rest } = registerUserDto;
        const hashedPassword = this.encrypter.hash( password );

        const newUser = await this.authRepository.registerUser({password : hashedPassword , ...rest })

        return newUser;
    }


}