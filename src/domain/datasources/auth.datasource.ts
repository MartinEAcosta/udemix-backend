import { RegisterUserDto } from "../dtos/auth/register-user.dto";
import { UserRequestDto, UserResponseDto } from "../dtos/auth/auth.responses.dto";

export abstract class AuthDatasource {

    abstract registerUser( registerUserDto : RegisterUserDto ) : Promise<UserResponseDto>;
    abstract updateUser ( user : UserRequestDto ) : Promise<UserResponseDto>;
    abstract findUserByEmail( email : string ): Promise<UserResponseDto | null>;
    abstract findUserById( id : string ) : Promise<UserResponseDto | null>;
    abstract findUserByIdWithCourses( id : string ) : Promise<UserResponseDto | null>;
    abstract acquireCourse( user : UserRequestDto , uid : string ) : Promise<UserResponseDto>;
 
}