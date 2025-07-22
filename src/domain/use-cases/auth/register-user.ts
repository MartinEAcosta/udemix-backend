import { UserEntity } from '../../entities/user.entity';
import { AuthRepository } from '../../repository/auth-repository';
import { RegisterUserDto } from './../../dtos/auth/register-user-dto';

export interface RegisterUserUseCase {
    execute( registerUserDto : RegisterUserDto ) : Promise<UserEntity>;
}

export class RegisterUser {

    constructor(
        private readonly authRepository : AuthRepository,
    ){}

    execute ( registerUserDto : RegisterUserDto ) : Promise<UserEntity> {
        return this.authRepository.registerUser( registerUserDto );
    }


}