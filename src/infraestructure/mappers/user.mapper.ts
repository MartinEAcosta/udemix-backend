import { IUserPopulateModel } from "../../data";
import { UserResponseDto } from "../../domain/dtos/auth/auth.responses.dto";

export class UserMapper {

    static fromUserResponseDto ( userDoc : IUserPopulateModel ) : UserResponseDto {
        return {
            id: userDoc._id.toString(),
            first_name: userDoc.first_name,
            last_name: userDoc.last_name,
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
