import { CustomError } from '../../errors/custom-error';
import { AuthRepository } from '../../repository/auth-repository';
import { TokenManager } from '../../services/TokenManager';

interface ValidateEmailUseCase {
    execute ( token : string ) : Promise<boolean>;
}

export class ValidateEmail implements ValidateEmailUseCase {


    constructor( 
        private readonly authRepository : AuthRepository,
        private readonly tokenManager   : TokenManager,
    ) { }


    async execute( token: string ) : Promise<boolean> {

        const payload = await this.tokenManager.validateToken( token );
        if( !payload ) throw CustomError.unauthorized('El token no es valido.');

        console.log(payload)
        const { email } = payload as { id : string , email : string };
        if( !email ) throw CustomError.internalServer('No se encontro el email en el token.');

        const user = await this.authRepository.findUserByEmail( email );
        if( !user ) throw CustomError.badRequest('No se ha encontrado un usuario vinculado a ese email.');

        const updatedUser = await this.authRepository.updateUser({
            ...user,
            isEmailVerified : true,
            role            : 'teacher',
        });
        if( !updatedUser ) throw CustomError.internalServer('Hubo un error inesperado al actualizar el usuario');


        return true;
    }   
    
}