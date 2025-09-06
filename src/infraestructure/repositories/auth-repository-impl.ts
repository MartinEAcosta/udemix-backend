import { AuthRepository } from "../../domain/repository/auth-repository";
import { AuthDatasource } from "../../domain/datasources/auth.datasource";

import { UserEntity } from "../../domain/entities/user.entity";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user.dto";
import { UserRequestDto } from "../../domain/dtos/auth/auth.responses.dto";

export class AuthRepositoryImpl implements AuthRepository {

    constructor(
        private readonly authDatasource : AuthDatasource,
    ) {}
    
    async updateUser( userRequestDto : UserRequestDto ) : Promise<UserEntity> {
        try{
            const updatedUser = await this.authDatasource.updateUser( userRequestDto );
            
            return UserEntity.fromObject( updatedUser );
        }
        catch( error ){
            throw error;
        }
    }
    
    async registerUser( registerUserDto: RegisterUserDto ) : Promise<UserEntity> {
        try{
            const savedUser = await this.authDatasource.registerUser( registerUserDto );
            
            return UserEntity.fromObject( savedUser );
        }
        catch( error ){
            throw error;
        }
    }
    
    async findUserByEmail( email : string ) : Promise<UserEntity | null> {
        try{
            const matchUser = await this.authDatasource.findUserByEmail( email );
            return matchUser != null ? UserEntity.fromObject(matchUser) : null;
        }
        catch( error ){
            throw error;
        }
    }
    
    async findUserById( id: string ) : Promise<UserEntity | null> {
        try{
            const user = await this.authDatasource.findUserById(id);
            return user != null ? UserEntity.fromObject(user) : null;
        }
        catch( error ){
            throw error;
        }
    }
    
    async findUserByIdWithCourses( id : string ) : Promise<UserEntity> {
        try{
            const user = await this.authDatasource.findUserByIdWithCourses( id );

            return UserEntity.fromObject( user! );
        }
        catch( error ){
            throw error;
        }
    }

    async acquireCourse( user : UserRequestDto , uid : string ) : Promise<UserEntity> {
        try{
            const userWithAcquiredCourse = await this.authDatasource.acquireCourse( user , uid );
            return UserEntity.fromObject( userWithAcquiredCourse );
        }
        catch( error ){
            throw error;
        }
    }

  
}