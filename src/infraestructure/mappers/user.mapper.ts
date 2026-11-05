import { IUserModel, IUserPopulateModel } from "../../data";
import { UserLoginResponseDto, UserResponseDto } from "../../domain/dtos/auth/auth.responses.dto";

export class UserMapper {

    static fromUserResponseDto ( userDoc : IUserModel ) : UserResponseDto{
        return {
            id: userDoc._id.toString(),
            username: userDoc.username,
            email: userDoc.email,
            isEmailVerified: userDoc.isEmailVerified,
            role: userDoc.role,
            password: userDoc.password ?? null,
            balance: userDoc.balance,
            id_file: userDoc.id_file?.toString() ?? null,
        }
    }

    // Usado únicamente por el flujo de login: el doc viene con `id_file` poblado y el avatar_url
    // se deriva en caliente desde el File relacionado — nunca se lee de un campo persistido.
    static fromLoginResponseDto ( userDoc : IUserPopulateModel ) : UserLoginResponseDto {
        return {
            id: userDoc._id.toString(),
            username: userDoc.username,
            email: userDoc.email,
            isEmailVerified: userDoc.isEmailVerified,
            role: userDoc.role,
            password: userDoc.password ?? null,
            balance: userDoc.balance,
            id_file: userDoc.id_file?._id.toString() ?? null,
            avatar_url: userDoc.id_file?.url ?? null,
        }
    }

}