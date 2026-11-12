import { AuthSuccessResponseDto } from "../../dtos";
import { SetPasswordDto } from "../../dtos/auth/set-password.dto";
import { CustomError } from "../../errors/custom-error";
import { AuthRepository } from "../../repository";
import { Encrypter, TokenManager } from "../../services";

interface SetPasswordUseCase {
    execute ( setPasswordDto : SetPasswordDto ) : Promise<AuthSuccessResponseDto>;
}

export class SetPassword implements SetPasswordUseCase {
    constructor(
        private readonly authRepository : AuthRepository,
        private readonly tokenManager : TokenManager,
        private readonly encrypter : Encrypter,
    ) {}

    async execute( setPasswordDto : SetPasswordDto ) : Promise<AuthSuccessResponseDto> {
        const user = await this.authRepository.findUserById( setPasswordDto.id );
        if( !user ) throw CustomError.notFound('Usuario no encontrado.');
        if( user.password ) throw CustomError.badRequest('El usuario ya tiene una contraseña establecida. Utilice la actualización de contraseña.');

        const hashedNewPassword = await this.encrypter.hash( setPasswordDto.new_password );
        const hasUpdated = await this.authRepository.updateUserPassword( setPasswordDto.id , hashedNewPassword );
        if( !hasUpdated ) throw CustomError.internalServer('Error al establecer la contraseña.');

        const token = await this.tokenManager.generateToken({
            id: user.id,
            email: user.email,
            isEmailVerified: user.isEmailVerified,
            role: user.role,
        });
        if( !token ) throw CustomError.internalServer('Error al generar el token.');

        const { password: hashedOfDB , ...userWithoutPass } = user;

        return {
            user: {
                ...userWithoutPass,
            },
            token: token,
        };
    }
}
