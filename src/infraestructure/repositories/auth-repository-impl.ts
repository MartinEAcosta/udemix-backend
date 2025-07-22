import { AuthDatasource } from "../../domain/datasources/auth.datasource";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user-dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { AuthRepository } from "../../domain/repository/auth-repository";


export class AuthRepositoryImpl implements AuthRepository {

    constructor(
        private readonly authDatasource : AuthDatasource,
    ) {}

    registerUser(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        return this.authDatasource.registerUser(registerUserDto);
    }

}