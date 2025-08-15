
import { RegisterUserDto } from './../../domain/dtos/auth/register-user-dto';
import { AuthDatasource } from "../../domain/datasources/auth.datasource";
import { IUserModel, UserModel } from './../../data/mongo/models/user.model';
import { CustomError } from '../../domain/errors/custom-error';


export class AuthDatasourceImpl implements AuthDatasource {

    async registerUser( registerUserDto : RegisterUserDto ) : Promise<IUserModel>{
        try{
            const savedUser = await UserModel.create( registerUserDto );
            if( !savedUser ) throw 'Hubo un error al registrar el usuario.'
            return savedUser;
        }
        catch( error ){
            console.log(error);
            throw CustomError.internalServer(`${error}`)
        }
    }

    async searchUserByEmail( email : string ): Promise<IUserModel | null> {
        try{
            const userExists = await UserModel.findOne({ 'email': email });
            if( !userExists ) return null;

            return userExists;
        }
        catch(error){
            console.log(error);
            throw CustomError.internalServer(`${error}`);
        }
    }

    async searchUserById( id : string ) : Promise<IUserModel | null> {
        try{
            const user = await UserModel.findById({ _id : id});
            // console.log(user);
            
            return user;
        }
        catch(error){
            console.log(error);
            throw CustomError.internalServer(`${error}`);
        }
    }
        
}