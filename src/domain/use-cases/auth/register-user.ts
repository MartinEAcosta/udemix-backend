import { UserEntity } from '../../entities/user.entity';
import { CustomError } from '../../errors/custom-error';
import { AuthRepository } from '../../repository/auth-repository';
import { RegisterUserDto } from './../../dtos/auth/register-user-dto';

export interface RegisterUserUseCase {
    execute( registerUserDto : RegisterUserDto ) : Promise<UserEntity>;
}

export class RegisterUser {

    constructor(
        private readonly authRepository : AuthRepository,
    ){}

    async execute ( registerUserDto : RegisterUserDto ) : Promise<UserEntity> {
        
        const userExists = await this.authRepository.searchUserByEmail( registerUserDto.email );
        if( userExists ) throw CustomError.badRequest( 'Ya existe una cuenta asociada a este email.' );
        
        const newUser : UserEntity = await this.authRepository.registerUser( registerUserDto );

        return newUser;
    }


}