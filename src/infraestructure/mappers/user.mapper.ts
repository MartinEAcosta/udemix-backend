import { IUserModel } from "../../data";
import { UserResponseDto } from "../../domain/dtos/auth/auth.responses.dto";

export class UserMapper {

    static fromUserResponseDto ( userDoc : IUserModel ) : UserResponseDto{
        return {
            id: userDoc._id.toString(),
            username: userDoc.username,
            email: userDoc.email,
            password: userDoc.password,
            balance: userDoc.balance,
        }
    }

}