
import { RegisterUserDto } from './../../domain/dtos/auth/register-user-dto';
import { AuthDatasource } from "../../domain/datasources/auth.datasource";
import { UserEntity } from "../../domain/entities/user.entity";
import { IUserModel, UserModel } from './../../data/mongo/models/user.model';
import { BcryptAdapter } from '../../config/bcrypt.adapter';
import { LoginUserDto } from '../../domain/dtos/auth/login-user-dto';
import { CustomError } from '../../domain/errors/custom-error';
import { JwtAdapter } from '../../config/jwt.adapter';


export class AuthDatasourceImpl implements AuthDatasource {

    async registerUser( registerUserDto : RegisterUserDto ) : Promise<IUserModel>{
        try{
            const savedUser = await UserModel.create( registerUserDto );
            console.log(savedUser);
            if( !savedUser ) throw 'Hubo un error al registrar el usuario.'
            
            return savedUser;
        }
        catch( error ){
            console.log(error);
            throw CustomError.internalServer(`${error}`)
        }
    }

    async searchUserByEmail( email : string ): Promise<UserEntity | null> {
        try{
            const userExists = await UserModel.findOne({ 'email': email });
            if( !userExists ) return null;

            return UserEntity.fromObject(userExists);
        }
        catch(error){
            console.log(error);
            throw CustomError.internalServer(`${error}`)
        }
    }

    async loginUser( loginUserDto : LoginUserDto) {
        const user = await UserModel.findOne({ email: loginUserDto.email });

        if( !user ) throw CustomError.badRequest('El email indicado no corresponde a un usuario existente.')

        const isMatching = BcryptAdapter.compare( loginUserDto.password , user.password );
        if( !isMatching ) throw CustomError.badRequest('Chequee los campos e intente nuevamente.');
        console.log(user);
        const token = JwtAdapter.generateJwt( user.id , user.email );

    }

    

    
}