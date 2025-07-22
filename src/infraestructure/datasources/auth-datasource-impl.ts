import { RegisterUserDto } from './../../domain/dtos/auth/register-user-dto';
import { AuthDatasource } from "../../domain/datasources/auth.datasource";
import { UserEntity } from "../../domain/entities/user.entity";
import { UserModel } from '../../data';


export class AuthDatasourceImpl implements AuthDatasource {

    async registerUser( registerUserDto : RegisterUserDto ): Promise<UserEntity> {
        try{
            const matchUser = await UserModel.findOne({ email : registerUserDto.email });

            if( matchUser ) throw 'Ya existe una cuenta asociada a este email.';

            const newUser = await UserModel.create( {...registerUserDto} );

            return UserEntity.fromObject( newUser );
        }
        catch( error ){
            console.log(error);
            throw 'Error inesperado al intentar crear el usuario.';
        }
    }

    

    
}