import { AuthSuccessResponseDto } from "../../dtos/auth/auth.responses.dto";
import { CustomError } from "../../errors/custom-error";
import { AuthRepository } from "../../repository/auth-repository";
import { TokenManager } from "../../services/TokenManager";


export interface ReloadTokenUseCase {
    execute( userId : string ) : Promise<AuthSuccessResponseDto>;
}

export class ReloadToken implements ReloadTokenUseCase {

    constructor(
        private readonly authRepository : AuthRepository,
        private readonly tokenManager   : TokenManager,
     ) { }

    async execute( userId : string ) : Promise<AuthSuccessResponseDto> {

        const user = await this.authRepository.findUserById( userId );
        if( !user ) throw CustomError.badRequest('El usuario no existe.');

        const payload = { 
                            id: user.id.toString(),
                            email           : user.email,
                            isEmailVerified : user.isEmailVerified,
                            role            : user.role,    
                        };

        const token = await this.tokenManager.generateToken( payload );
        if( !token ) throw CustomError.internalServer( 'Hubo un error al generar el token');

        const { password , ...rest } = user;

        return {
            user : rest,
            token,
        }
    }
}
