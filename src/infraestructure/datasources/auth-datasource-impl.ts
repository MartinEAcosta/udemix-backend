
import { AuthDatasource } from "../../domain/datasources/auth.datasource";
import { UserModel } from './../../data/mongo/models/user.model';
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { UserResponseDto } from "../../domain/dtos/auth/auth.responses.dto";


export class AuthDatasourceImpl implements AuthDatasource {

    async registerUser( registerUserDto : RegisterUserDto ) : Promise<UserResponseDto>{
            const savedUser = await UserModel.create( registerUserDto );
            return savedUser;
    }

    async searchUserByEmail( email : string ): Promise<UserResponseDto | null> {
            const userExists = await UserModel.findOne({ 'email': email });
            if( !userExists ) return null;

            return userExists;
    }

    async searchUserById( id : string ) : Promise<UserResponseDto | null> {
            const user = await UserModel.findById({ _id : id});
            return user;
    }
        
}