import { UserEntity } from "../entities/user.entity";

import { RegisterUserDto } from "../dtos/auth/register-user.dto";

export abstract class AuthRepository {

    abstract registerUser( registerUserDto : RegisterUserDto ) : Promise<UserEntity>;
    abstract searchUserByEmail( email : string ) : Promise<UserEntity | null>;
    abstract searchUserById( id : string ) : Promise<UserEntity | null>;
}