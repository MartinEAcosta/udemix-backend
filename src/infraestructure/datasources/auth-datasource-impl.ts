
import { AuthDatasource } from "../../domain/datasources/auth.datasource";
import { UserModel } from './../../data/mongo/models/user.model';
import { UserMapper } from "../mappers/user.mapper";
import { RegisterUserDto } from '../../domain/dtos/auth/register-user.dto';
import { UserRequestDto, UserResponseDto } from "../../domain/dtos/auth/auth.responses.dto";


export class AuthDatasourceImpl implements AuthDatasource {
        
        
        async registerUser( registerUserDto : RegisterUserDto ) : Promise<UserResponseDto>{
                const savedUser = await UserModel.create( registerUserDto );
                return UserMapper.fromUserResponseDto( savedUser );
        }
        
        async findUserByEmail( email : string ): Promise<UserResponseDto | null> {
                const userExists = await UserModel.findOne({ 'email': email });
                if( !userExists ) return null;
                
                return UserMapper.fromUserResponseDto( userExists );
        }

        async findUserById( id : string ) : Promise<UserResponseDto | null> {
                const user = await UserModel.findById({ _id : id});
                if( !user ) return null;
                
                return UserMapper.fromUserResponseDto( user );  
        }
        
        async findUserByIdWithCourses( id : string ) : Promise<UserResponseDto | null> {
                const user = await UserModel.findById( { _id : id } ).populate('enrolledCourses');
                if( !user ) return null;

                return UserMapper.fromUserResponseDto( user );
        }

        async acquireCourse( user : UserRequestDto , uid : string ) : Promise<UserResponseDto> {
                const updatedUser = await UserModel.findByIdAndUpdate( uid , user , { new : true } );

                return UserMapper.fromUserResponseDto( updatedUser );
        }
}