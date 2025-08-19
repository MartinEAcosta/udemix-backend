import { RegisterUserDto } from "../dtos/auth/register-user.dto";
import { UserResponseDto } from "../dtos/auth/auth.responses.dto";
export abstract class AuthDatasource {

    abstract registerUser( registerUserDto : RegisterUserDto ) : Promise<UserResponseDto>;
    abstract searchUserByEmail( email : string ): Promise<UserResponseDto | null>;
    abstract searchUserById( id : string ) : Promise<UserResponseDto | null>;

}