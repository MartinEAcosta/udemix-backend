import { IUserModel } from "../../data";
import { RegisterUserDto } from "../dtos/auth/register-user-dto";
import { UserEntity } from "../entities/user.entity";


export abstract class AuthDatasource {

    abstract registerUser( registerUserDto : RegisterUserDto ) : Promise<IUserModel>;
    abstract searchUserByEmail( email : string ): Promise<IUserModel | null>;
    abstract searchUserById( id : string ) : Promise<IUserModel | null>;
}