import { Request, Response } from "express";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user-dto";
import { RegisterUser } from "../../domain/use-cases/auth/register-user";
import { AuthRepository } from "../../domain/repository/auth-repository";
import { LoginUserDto } from "../../domain/dtos/auth/login-user-dto";
import { LoginUser } from "../../domain/use-cases/auth/login-user";
import { Encrypter } from "../../domain/services/Encrypter";
import { TokenManager } from "../../domain/services/TokenManager";
import { HandlerResponses } from "../helpers/handlerResponses";

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
            .then( userResponse => res.status(201).json( userResponse ) )
            .catch( error => HandlerResponses.handleError(error,res) );  
    }

    loginUser = ( req : Request , res : Response ) => {
        const [ error , loginUserDto ] = LoginUserDto.create( req.body );
        if( error ) return res.status(400).json({
            error : error,
        })

        new LoginUser( this.authRepository , this.encrypter , this.tokenManager )
            .execute( loginUserDto! )
            .then( loginResponse => res.status(200).json( loginResponse ) )
            .catch( error => HandlerResponses.handleError(error , res ) );
    }

    reloadToken = ( req : Request , res : Response ) => {
        throw 'reload';
    }
}