import { AuthResponseDto } from "../../dtos/auth/auth.responses.dto";
import { UpdateUserDto } from "../../dtos/auth/update-user-dto";
import { CustomError } from "../../errors/custom-error";
import { AuthRepository } from "../../repository";

interface UpdateUserUseCase {
    execute( userDto : UpdateUserDto , userId : string ): Promise<AuthResponseDto>;
}

export class UpdateUser implements UpdateUserUseCase {

    constructor (
        private readonly authRepository : AuthRepository,
    ) { }

    async execute( userDto : UpdateUserDto ) : Promise<AuthResponseDto> {

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

        return {
            id: updatedUser.id,
            username: updatedUser.username,
            email: updatedUser.email,
            isEmailVerified: updatedUser.isEmailVerified,
        };
    }

}