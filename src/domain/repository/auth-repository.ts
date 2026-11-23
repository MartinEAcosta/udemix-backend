import { UserEntity } from "../entities/user.entity";

import { RegisterUserDto } from "../dtos/auth/register-user.dto";
import { TransactionSession } from "../services/UnitOfWork";
import { UpdateUserDto } from "../dtos/auth/update-user-dto";
import { UpdateUserAvatarDto } from "../dtos/auth/update-user-avatar.dto";

export abstract class AuthRepository {

    abstract registerUser( registerUserDto : RegisterUserDto ) : Promise<UserEntity>;
    abstract findUserByEmail( email : string ) : Promise<UserEntity | null>;
    abstract findUserById( id : string ) : Promise<UserEntity | null>;
    abstract updateUser ( updateUserDto : UpdateUserDto ,ts ?: TransactionSession ) : Promise<UserEntity>;
    /** Único camino para escribir id_file + avatar_url. updateUser no los toca. */
    abstract updateUserAvatar ( avatarDto : UpdateUserAvatarDto ) : Promise<UserEntity>;
    abstract updateUserPassword( userId : string , hashedPassword : string ) : Promise<UserEntity>;

}
