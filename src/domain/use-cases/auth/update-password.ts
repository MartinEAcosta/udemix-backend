import { AuthSuccessResponseDto } from "../../dtos";
import { UpdatePasswordDto } from "../../dtos/auth/update-password.dto";
import { CustomError } from "../../errors/custom-error";
import { AuthRepository } from "../../repository";
import { Encrypter, TokenManager } from "../../services";

interface UpdatePasswordUseCase {
    execute ( updatePasswordDto : UpdatePasswordDto ) : Promise<AuthSuccessResponseDto>;
}

export class UpdatePassword implements UpdatePasswordUseCase {
    constructor(
        private readonly authRepository : AuthRepository,
        private readonly tokenManager : TokenManager,
        private readonly encrypter : Encrypter,
    ) {}

    async execute( updatePasswordDto : UpdatePasswordDto ) : Promise<AuthSuccessResponseDto> {
        const user = await this.authRepository.findUserById( updatePasswordDto.id );
        if( !user ) throw CustomError.notFound('Usuario no encontrado.');
        if( !user.password ) throw CustomError.badRequest('El usuario no tiene contraseña establecida.');

        const isCurrentPasswordValid = await this.encrypter.compare( updatePasswordDto.current_password , user.password! );
        if( !isCurrentPasswordValid ) throw CustomError.unauthorized('La contraseña actual es incorrecta.');

        const hashedNewPassword = await this.encrypter.hash( updatePasswordDto.new_password );
        const hasUpdated = await this.authRepository.updateUserPassword( updatePasswordDto.id , hashedNewPassword );
        if( !hasUpdated ) throw CustomError.internalServer('Error al actualizar la contraseña.');

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