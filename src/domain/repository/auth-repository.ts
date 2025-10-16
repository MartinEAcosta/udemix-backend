import { UserEntity } from "../entities/user.entity";

import { RegisterUserDto } from "../dtos/auth/register-user.dto";
import { UserRequestDto } from "../dtos/auth/auth.responses.dto";
import { TransactionSession } from "../services/UnitOfWork";

export abstract class AuthRepository {

    abstract registerUser( registerUserDto : RegisterUserDto ) : Promise<UserEntity>;
    abstract findUserByEmail( email : string ) : Promise<UserEntity | null>;
    abstract findUserById( id : string ) : Promise<UserEntity | null>;
    abstract updateUser ( user : UserRequestDto , ts ?: TransactionSession ) : Promise<UserEntity>;
    
}