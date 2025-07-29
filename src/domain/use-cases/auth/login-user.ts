import { AuthRepository } from "../../repository/auth-repository";
import { TokenManager } from "../../services/TokenManager";
import { Encrypter } from "../../services/Encrypter";

import { LoginUserDto } from "../../dtos/auth/login-user-dto";
import { AuthSuccessResponse } from "../../dtos/auth/responses";
import { CustomError } from "../../errors/custom-error";

interface LoginUserUseCase {
    execute( loginUserDto : LoginUserDto ) : Promise<AuthSuccessResponse> ;
}

export class LoginUser implements LoginUserUseCase{
    
    constructor( 
        private readonly authRepository : AuthRepository,
        private readonly encrypter : Encrypter,
        private readonly tokenManager : TokenManager,
    ) {}

    async execute(loginUserDto: LoginUserDto) : Promise<AuthSuccessResponse> {
        
        const userExists = await this.authRepository.searchUserByEmail( loginUserDto.email );
        if( !userExists ) throw CustomError.badRequest('El email ingresado no se encuentra vinculado a una cuenta.');

        const { password , ...rest } = loginUserDto;    
        const isMatching = this.encrypter.compare( password , userExists.password! );
        if( !isMatching ) throw CustomError.badRequest('Chequee las credenciales e intente nuevamente.');

        const payload = {
            id: userExists.id,
            email: userExists.email 
        }

        const token = await this.tokenManager.generateToken( payload );
        if( !token ) throw CustomError.internalServer('Error mientras se generaba el token.');
        
        const { password:hashedOfDB , ...userWithoutPass } = userExists;  

        return {
            user : userWithoutPass,
            token : token,
        };
    }

}