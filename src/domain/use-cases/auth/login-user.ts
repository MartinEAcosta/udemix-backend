import { LoginUserDto } from "../../dtos/auth/login-user-dto";
import { UserEntity } from "../../entities/user.entity";
import { CustomError } from "../../errors/custom-error";
import { AuthRepository } from "../../repository/auth-repository";

interface LoginUserUseCase {
    execute( loginUserDto : LoginUserDto ) : Promise<UserEntity> ;
}

export class LoginUser implements LoginUserUseCase{
    
    constructor( 
        private readonly authRepository : AuthRepository,
    ) {}

    async execute(loginUserDto: LoginUserDto): Promise<UserEntity> {
        
        const userExists = await this.authRepository.searchUserByEmail( loginUserDto.email );
        if( !userExists ) throw CustomError.badRequest('El email ingresado no se encuentra vinculado a una cuenta.');

        const user = await this.authRepository.loginUser( loginUserDto , userExists! );
        if( !user ) throw CustomError.badRequest('Chequee las credenciales e intente nuevamente.');

        return user;
    }

}