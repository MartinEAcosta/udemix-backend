import { Request, Response } from "express";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user-dto";
import { RegisterUser } from "../../domain/use-cases/auth/register-user";
import { AuthRepository } from "../../domain/repository/auth-repository";
import { LoginUserDto } from "../../domain/dtos/auth/login-user-dto";
import { LoginUser } from "../../domain/use-cases/auth/login-user";
import { Encrypter } from "../../domain/services/Encrypter";
import { HandlerResponses } from './../helpers/handlerResponses';
import { TokenManager } from "../../domain/services/TokenManager";
import { UserEntity } from "../../domain/entities/user.entity";
import { GetUserById } from "../../domain/use-cases/auth/get-user-by-id";

export class AuthController {

    constructor(
        private readonly authRepository : AuthRepository,
        private readonly encrypter : Encrypter,
        private readonly tokenManager : TokenManager,
    ){}

    registerUser = ( req : Request , res : Response ) => {
        const [ error , registerUserDto ] = RegisterUserDto.create( req.body );
        if( error ) return res.status(400).json({
            error : error,
        });
        new RegisterUser( this.authRepository , this.encrypter , this.tokenManager )      
            .execute( registerUserDto! )
            .then( authResponse => HandlerResponses.handleAuthSuccess( res , authResponse , 201 ) )
            .catch( error => HandlerResponses.handleError(error,res) );  
    }

    loginUser = ( req : Request , res : Response ) => {
        const [ error , loginUserDto ] = LoginUserDto.create( req.body );
        if( error ) return res.status(400).json({
            error : error,
        })

        new LoginUser( this.authRepository , this.encrypter , this.tokenManager )
            .execute( loginUserDto! )
            .then( authResponse => HandlerResponses.handleAuthSuccess( res , authResponse , 200 ) )
            .catch( error => HandlerResponses.handleError(error , res ) );
    }

    reloadToken = async( req : Request , res : Response ) => {

        const user = (req as Request & { user?: UserEntity }).user;
        if( !user ) return;

        new GetUserById( this.authRepository )
            .execute( user.id )
            .then( async userResponse => {
                const payload = { id: user.id.toString() };
                const token = await this.tokenManager.generateToken( payload );
                if( !token ) return HandlerResponses.handleError( 'Hubo un error al generar el token', res );
                HandlerResponses.handleAuthSuccess( res , { user: userResponse , token } );
            } )
            .catch( error => HandlerResponses.handleError( error , res ) );
        
    }
}