import { AuthResponseDto, AuthSuccessResponseDto } from "../../dtos/auth/auth.responses.dto";
import { UpdateUserDto } from "../../dtos/auth/update-user-dto";
import { CustomError } from "../../errors/custom-error";
import { AuthRepository } from "../../repository";
import { TokenManager } from "../../services";

interface UpdateUserUseCase {
    execute( userDto : UpdateUserDto ): Promise<AuthSuccessResponseDto>;
}

export class UpdateUser implements UpdateUserUseCase {

    constructor (
        private readonly authRepository : AuthRepository,
        private readonly tokenManager : TokenManager,
    ) { }

    async execute( userDto : UpdateUserDto ) : Promise<AuthSuccessResponseDto> {

        const userExists = await this.authRepository.findUserById( userDto.id );
        if( !userExists ) throw CustomError.badRequest('El usuario no existe.');
        if( userDto.email && userDto.email !== userExists.email ) {
            const emailExists = await this.authRepository.findUserByEmail( userDto.email );
            if( emailExists ) throw CustomError.badRequest('El email ya esta en uso.');
        }
        
        // Si cambian el email, se marca como no verificado, sino me devuelve el dto normal.
        const updateData = userDto.email != null && userDto.email !== userExists.email
            ? { ...userDto, isEmailVerified: false }
            : userDto;
        const updatedUser = await this.authRepository.updateUser( updateData );
        if( !updatedUser ) throw CustomError.internalServer('Error al actualizar el usuario.');

        const payload = {
            id : updatedUser.id,
            email : updatedUser.email,
            isEmailVerified : updatedUser.isEmailVerified,
            role : updatedUser.role,
        }
        const token = await this.tokenManager.generateToken(payload)
        if( !token ) throw CustomError.internalServer('Error mientras se generaba el token.');

        const { password : pass , ...userWithoutPass} = updatedUser;

        return {
            user: userWithoutPass,
            token: token,
        };
    }

}