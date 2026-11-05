import { UserEntity } from "../entities/user.entity";

import { RegisterUserDto } from "../dtos/auth/register-user.dto";
import { TransactionSession } from "../services/UnitOfWork";
import { UpdateUserDto } from "../dtos/auth/update-user-dto";
import { UserLoginResponseDto } from "../dtos/auth/auth.responses.dto";

export abstract class AuthRepository {

    abstract registerUser( registerUserDto : RegisterUserDto ) : Promise<UserEntity>;
    abstract findUserByEmail( email : string ) : Promise<UserEntity | null>;
    abstract findUserById( id : string ) : Promise<UserEntity | null>;
    abstract updateUser ( updateUserDto : UpdateUserDto ,ts ?: TransactionSession ) : Promise<UserEntity>;
    // Excepción deliberada: devuelve un DTO (no una UserEntity) porque avatar_url es un dato derivado,
    // nunca persistido, que solo tiene sentido en la respuesta del login. Ver auth.responses.dto.ts.
    abstract findUserByEmailForLogin( email : string ) : Promise<UserLoginResponseDto | null>;

}