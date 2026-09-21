import { AuthDatasource } from "../../domain/datasources/auth-datasource";
import { UserModel } from "./../../data/mongo/models/user.model";
import { UserMapper } from "../mappers/user.mapper";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import {
  UserResponseDto,
} from "../../domain/dtos/auth/auth.responses.dto";
import { UpdateUserDto } from "../../domain/dtos/auth/update-user-dto";

export class AuthDatasourceImpl implements AuthDatasource {
  async registerUser( registerUserDto: RegisterUserDto): Promise<UserResponseDto> {
    const savedUser = await UserModel.create(registerUserDto);
    
    return UserMapper.fromUserResponseDto(savedUser);
  }

  async updateUser(userDto : UpdateUserDto): Promise<UserResponseDto> {
    const updatedUser = await UserModel.findByIdAndUpdate(userDto.id, userDto, {
      new: true,
    });

    return UserMapper.fromUserResponseDto(updatedUser!);
  }

  async findUserByEmail(email: string): Promise<UserResponseDto | null> {
    const userExists = await UserModel.findOne({ email: email });
    if (!userExists) return null;

    return UserMapper.fromUserResponseDto(userExists);
  }

  async findUserById(id: string): Promise<UserResponseDto | null> {
    const user = await UserModel.findById({ _id: id });
    if (!user) return null;

    return UserMapper.fromUserResponseDto(user);
  }
}
