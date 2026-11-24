import { RegisterUserDto } from "../dtos/auth/register-user.dto";
import { UserResponseDto } from "../dtos/auth/auth.responses.dto";
import { UpdateUserDto } from "../dtos/auth/update-user-dto";
import { UpdateUserAvatarDto } from "../dtos/auth/update-user-avatar.dto";

export abstract class AuthDatasource {

    abstract registerUser( registerUserDto : RegisterUserDto ) : Promise<UserResponseDto>;
    abstract updateUser ( userDto : UpdateUserDto ) : Promise<UserResponseDto>;
    /** Único camino para escribir id_file + avatar_url. updateUser no los toca. */
    abstract updateUserAvatar ( avatarDto : UpdateUserAvatarDto ) : Promise<UserResponseDto>;
    abstract updateUserPassword( userId : string , hashedPassword : string ) : Promise<UserResponseDto>;
    abstract findUserByEmail( email : string ): Promise<UserResponseDto | null>;
    abstract findUserById( id : string ) : Promise<UserResponseDto | null>;

}
