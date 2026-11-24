import { IUserModel, UserModel } from "./../../data/mongo/models/user.model";
import { AuthDatasource } from "../../domain/datasources/auth-datasource";
import { CustomError } from "../../domain/errors/custom-error";
import { UserMapper } from "../mappers/user.mapper";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { UserResponseDto } from "../../domain/dtos/auth/auth.responses.dto";
import { UpdateUserDto } from "../../domain/dtos/auth/update-user-dto";
import { UpdateUserAvatarDto } from "../../domain/dtos/auth/update-user-avatar.dto";

export class AuthDatasourceImpl implements AuthDatasource {
  async registerUser( registerUserDto: RegisterUserDto): Promise<UserResponseDto> {
    const savedUser = await UserModel.create(registerUserDto);

    return UserMapper.fromUserResponseDto( savedUser.toObject<IUserModel>() );
  }

  /**
   * Update genérico del perfil.
   *
   * `id_file` y `avatar_url` quedan deliberadamente fuera de la whitelist: los escribe
   * únicamente updateUserAvatar, para que el FK y su copia desnormalizada no se separen.
   * La lista explícita de abajo es lo que defiende el documento, no la firma del parámetro ni
   * el prototipo: se nombra cada campo en vez de spreadear el DTO, así una propiedad agregada a
   * la instancia (Object.assign, Object.create) nunca llega al $set.
   */
  async updateUser(userDto : UpdateUserDto): Promise<UserResponseDto> {
    const { id } = userDto;
    const fieldsToUpdate = {
      first_name      : userDto.first_name,
      last_name       : userDto.last_name,
      email           : userDto.email,
      password        : userDto.password,
      isEmailVerified : userDto.isEmailVerified,
      balance         : userDto.balance,
    };

    const updatedUser = await UserModel
      .findByIdAndUpdate( id , { $set : fieldsToUpdate } , { new : true } )
      .lean<IUserModel | null>();

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
