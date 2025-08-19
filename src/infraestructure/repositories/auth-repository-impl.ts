import { AuthDatasource } from "../../domain/datasources/auth.datasource";
import { AuthRepository } from "../../domain/repository/auth-repository";
import { UserEntity } from "../../domain/entities/user.entity";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { CustomError } from "../../domain/errors/custom-error";

export class AuthRepositoryImpl implements AuthRepository {

    constructor(
        private readonly authDatasource : AuthDatasource,
    ) {}

    async registerUser( registerUserDto: RegisterUserDto ) : Promise<UserEntity> {
        try{
            const savedUser = await this.authDatasource.registerUser( registerUserDto );
    
            return UserEntity.fromObject( savedUser );
        }
        catch( error ){
            throw CustomError.internalServer('Hubo un error al regitrar el usuario.');
        }
    }

    async searchUserByEmail( email : string ) : Promise<UserEntity | null> {
        try{
            const matchUser = await this.authDatasource.searchUserByEmail( email );
            return matchUser != null ? UserEntity.fromObject(matchUser) : null;
        }
        catch( error ){
            throw CustomError.internalServer('Hubo un error al buscar el usuario por email.');
        }
    }
    
    async searchUserById( id: string ) : Promise<UserEntity | null> {
        try{
            const user = await this.authDatasource.searchUserById(id);
            return user != null ? UserEntity.fromObject(user) : null;
        }
        catch( error ){
            throw CustomError.internalServer('Hubo un error al buscar el usuario por id.');
        }
    }


  
}