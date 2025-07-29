import { AuthDatasource } from "../../domain/datasources/auth.datasource";
import { AuthRepository } from "../../domain/repository/auth-repository";
import { UserEntity } from "../../domain/entities/user.entity";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user-dto";
import { IUserModel } from "../../data";
import { JwtAdapter , BcryptAdapter} from "../../config/";


export class AuthRepositoryImpl implements AuthRepository {

    constructor(
        private readonly authDatasource : AuthDatasource,
    ) {}

    async registerUser( registerUserDto: RegisterUserDto ) : Promise<UserEntity> {
        const savedUser = await this.authDatasource.registerUser( registerUserDto );

        return UserEntity.fromObject( savedUser );
    }

    async searchUserByEmail( email : string ) : Promise<UserEntity | null> {
        const matchUser : IUserModel | null = await this.authDatasource.searchUserByEmail( email );
        return matchUser != null ? UserEntity.fromObject(matchUser!) : null;
    }
    
    async searchUserById( id: string ) : Promise<UserEntity | null> {
        const user : IUserModel | null = await this.authDatasource.searchUserById(id);
        return user != null ? UserEntity.fromObject(user) : null;
    }


  
}