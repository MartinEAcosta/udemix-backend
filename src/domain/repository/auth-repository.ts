import { IUserModel } from "../../data";
import { LoginUserDto } from "../dtos/auth/login-user-dto";
import { RegisterUserDto } from "../dtos/auth/register-user-dto";
import { UserEntity } from "../entities/user.entity";



export abstract class AuthRepository {

    abstract registerUser( registerUserDto : RegisterUserDto ) : Promise<UserEntity>;
    abstract searchUserByEmail( email : string ) : Promise<UserEntity | null>;
}