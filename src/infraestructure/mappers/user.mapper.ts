import { UserResponseDto } from "../../domain/dtos/auth/auth.responses.dto";

export class UserMapper {

    static fromUserResponseDto ( userDoc : any ) : UserResponseDto{
        return {
            id: userDoc._id,
            username: userDoc.username,
            email: userDoc.email,
            password: userDoc.password,
            balance: userDoc.balance,
            enrolledCourses: userDoc.enrolledCourses.map( ( course : any ) => course._id ) || [],
        }
    }

}