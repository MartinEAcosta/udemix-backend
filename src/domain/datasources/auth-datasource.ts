import { RegisterUserDto } from "../dtos/auth/register-user.dto";
import { UserResponseDto } from "../dtos/auth/auth.responses.dto";
import { UpdateUserDto } from "../dtos/auth/update-user-dto";

export abstract class AuthDatasource {

    abstract registerUser( registerUserDto : RegisterUserDto ) : Promise<UserResponseDto>;
    abstract updateUser ( userDto : UpdateUserDto ) : Promise<UserResponseDto>;
    abstract findUserByEmail( email : string ): Promise<UserResponseDto | null>;
    abstract findUserById( id : string ) : Promise<UserResponseDto | null>;
 
}