import { BcryptAdapter } from "../../config/bcrypt.adapter";
import { JwtAdapter } from "../../config/jwt.adapter";
import { IUserModel, UserModel } from "../../data";
import { AuthDatasource } from "../../domain/datasources/auth.datasource";
import { LoginUserDto } from "../../domain/dtos/auth/login-user-dto";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user-dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { AuthRepository } from "../../domain/repository/auth-repository";


export class AuthRepositoryImpl implements AuthRepository {

    constructor(
        private readonly authDatasource : AuthDatasource,
    ) {}

    async registerUser(registerUserDto: RegisterUserDto) : Promise<UserEntity> {
        const savedUser = await this.authDatasource.registerUser( registerUserDto );

        return UserEntity.fromObject( savedUser );
    }

    async searchUserByEmail( email : string ): Promise<UserEntity | null> {
        const matchUser : IUserModel | null = await this.authDatasource.searchUserByEmail( email );
        
        return matchUser != null ? UserEntity.fromObject(matchUser!) : null;
    }


  
}