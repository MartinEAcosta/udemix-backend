import { AuthDatasource } from "../../domain/datasources/auth-datasource";
import { IUserModel, UserModel } from "./../../data/mongo/models/user.model";
import { UserMapper } from "../mappers/user.mapper";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { UserResponseDto } from "../../domain/dtos/auth/auth.responses.dto";
import { UpdateUserDto } from "../../domain/dtos/auth/update-user-dto";
import { UpdateUserAvatarDto } from "../../domain/dtos/auth/update-user-avatar.dto";
import { CustomError } from "../../domain/errors/custom-error";

export class AuthDatasourceImpl implements AuthDatasource {
  async registerUser( registerUserDto: RegisterUserDto): Promise<UserResponseDto> {
    const savedUser = await UserModel.create(registerUserDto);

    return UserMapper.fromUserResponseDto( savedUser.toObject<IUserModel>() );
  }

  /**
   * Update genérico del perfil. El objeto de $set se arma campo por campo a propósito:
   * antes se pasaba el DTO completo a findByIdAndUpdate, así que cualquier propiedad que
   * llegara por esta vía — body HTTP o spread de una entidad entera — alcanzaba el documento.
   * `id_file` y `avatar_url` quedan deliberadamente fuera: sólo los escribe updateUserAvatar.
   */
  async updateUser(userDto : UpdateUserDto): Promise<UserResponseDto> {
    const updateFields : Partial<Pick<IUserModel , 'first_name' | 'last_name' | 'email' | 'password' | 'isEmailVerified' | 'balance'>> = {};

    // `!== undefined` y no un truthy check: password admite null a propósito
    // (ver UpdateUserDto.reclaimUnverifiedAccount) e isEmailVerified admite false.
    if( userDto.first_name !== undefined )      updateFields.first_name = userDto.first_name;
    if( userDto.last_name !== undefined )       updateFields.last_name = userDto.last_name;
    if( userDto.email !== undefined )           updateFields.email = userDto.email;
    if( userDto.password !== undefined )        updateFields.password = userDto.password;
    if( userDto.isEmailVerified !== undefined ) updateFields.isEmailVerified = userDto.isEmailVerified;
    if( userDto.balance !== undefined )         updateFields.balance = userDto.balance;

    // Mongo rechaza un $set vacío, así que un update sin campos se resuelve como lectura.
    const updatedUser = Object.keys( updateFields ).length === 0
      ? await UserModel.findById( userDto.id ).lean<IUserModel | null>()
      : await UserModel.findByIdAndUpdate( userDto.id , { $set : updateFields } , { new : true } ).lean<IUserModel | null>();

    if( !updatedUser ) throw CustomError.notFound('El usuario que intentas actualizar no existe.');

    return UserMapper.fromUserResponseDto(updatedUser);
  }

  /**
   * El par id_file + avatar_url se escribe en un único $set sobre un solo documento, que Mongo
   * garantiza atómico: la copia desnormalizada no puede quedar apuntando a otro File que el FK.
   */
  async updateUserAvatar( avatarDto : UpdateUserAvatarDto ) : Promise<UserResponseDto> {
    const updatedUser = await UserModel.findByIdAndUpdate(
      avatarDto.id_user,
      { $set : { id_file : avatarDto.id_file , avatar_url : avatarDto.avatar_url } },
      { new : true },
    ).lean<IUserModel | null>();

    if( !updatedUser ) throw CustomError.notFound('El usuario del que intentas actualizar el avatar no existe.');

    return UserMapper.fromUserResponseDto(updatedUser);
  }

  async updateUserPassword( userId : string , hashedPassword : string ) : Promise<UserResponseDto> {
    const updatedUser = await UserModel.findByIdAndUpdate( userId , { $set : { password : hashedPassword } } , { new : true })
                                          .lean<IUserModel | null>();

    if( !updatedUser ) throw CustomError.notFound('El usuario al que intentas cambiarle la contraseña no existe.');

    return UserMapper.fromUserResponseDto(updatedUser);
  }

  async findUserByEmail(email: string): Promise<UserResponseDto | null> {
    const userExists = await UserModel.findOne({ email: email }).lean<IUserModel | null>();
    if (!userExists) return null;

    return UserMapper.fromUserResponseDto(userExists);
  }

  async findUserById(id: string): Promise<UserResponseDto | null> {
    const user = await UserModel.findById({ _id: id }).lean<IUserModel | null>();
    if (!user) return null;

    return UserMapper.fromUserResponseDto(user);
  }
}
