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
        const { password ,...rest } = registerUserDto;

        const newUser = {...rest, password : BcryptAdapter.hash(password) };

        const savedUser = await this.authDatasource.registerUser( newUser );

        return UserEntity.fromObject( savedUser );
    }

    async loginUser(loginUserDto: LoginUserDto , userRecord : IUserModel): Promise<UserEntity | null> {
        const isMatching = BcryptAdapter.compare( loginUserDto.password , userRecord.password );
        if( !isMatching ) return null;
        
        return UserEntity.fromObject( userRecord );
    }

    async searchUserByEmail( email : string ): Promise<UserEntity | null> {
        const matchUser : IUserModel | null = await this.authDatasource.searchUserByEmail( email );
        
        return matchUser != null ? UserEntity.fromObject(matchUser!) : null;
    }


  
}