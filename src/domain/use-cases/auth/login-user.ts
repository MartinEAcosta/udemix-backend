import { LoginUserDto } from "../../dtos/auth/login-user-dto";
import { LoginUserResponse } from "../../dtos/auth/responses";
import { CustomError } from "../../errors/custom-error";
import { AuthRepository } from "../../repository/auth-repository";
import { Encrypter } from "../../services/Encrypter";
import { TokenManager } from "../../services/TokenManager";

interface LoginUserUseCase {
    execute( loginUserDto : LoginUserDto ) : Promise<LoginUserResponse> ;
}

export class LoginUser implements LoginUserUseCase{
    
    constructor( 
        private readonly authRepository : AuthRepository,
        private readonly encrypter : Encrypter,
        private readonly tokenManager : TokenManager,
    ) {}

    async execute(loginUserDto: LoginUserDto) : Promise<LoginUserResponse> {
        
        const userExists = await this.authRepository.searchUserByEmail( loginUserDto.email );
        if( !userExists ) throw CustomError.badRequest('El email ingresado no se encuentra vinculado a una cuenta.');

        const { password , ...rest } = loginUserDto;    
        const isMatching = this.encrypter.compare( password , userExists.password! );
        if( !isMatching ) throw CustomError.badRequest('Chequee las credenciales e intente nuevamente.');

        const token = await this.tokenManager.generateToken( userExists.id , userExists.email );

        const { password:hashedOfDB , ...userWithoutPass } = userExists;  

        return {
            user : userWithoutPass,
            token : token,
        };
    }

}