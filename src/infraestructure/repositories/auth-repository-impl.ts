import { AuthRepository } from "../../domain/repository/auth-repository";
import { AuthDatasource } from "../../domain/datasources/auth.datasource";

import { UserEntity } from "../../domain/entities/user.entity";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";

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
            throw error;
        }
    }

    async searchUserByEmail( email : string ) : Promise<UserEntity | null> {
        try{
            const matchUser = await this.authDatasource.searchUserByEmail( email );
            return matchUser != null ? UserEntity.fromObject(matchUser) : null;
        }
        catch( error ){
            throw error;
        }
    }
    
    async searchUserById( id: string ) : Promise<UserEntity | null> {
        try{
            const user = await this.authDatasource.searchUserById(id);
            return user != null ? UserEntity.fromObject(user) : null;
        }
        catch( error ){
            throw error;
        }
    }


  
}