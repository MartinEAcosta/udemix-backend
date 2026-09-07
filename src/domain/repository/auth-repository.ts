import { UserEntity } from "../entities/user.entity";

import { RegisterUserDto } from "../dtos/auth/register-user.dto";
import { TransactionSession } from "../services/UnitOfWork";
import { UserRequestDto } from "../dtos/auth/auth.responses.dto";

export abstract class AuthRepository {

    abstract registerUser( registerUserDto : RegisterUserDto ) : Promise<UserEntity>;
    abstract findUserByEmail( email : string ) : Promise<UserEntity | null>;
    abstract findUserById( id : string ) : Promise<UserEntity | null>;
    abstract updateUser ( updateUserDto : UserRequestDto ,ts ?: TransactionSession ) : Promise<UserEntity>;
    
}