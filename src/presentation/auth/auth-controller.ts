import { Request, Response } from "express";

import { AuthRepository } from "../../domain/repository/auth-repository";
import { Encrypter } from "../../domain/services/Encrypter";
import { TokenManager } from "../../domain/services/TokenManager";
import { CustomError } from "../../domain/errors/custom-error";
import { HandlerResponses } from '../helpers/handler-responses';

import { RegisterUserDto , LoginUserDto } from "../../domain/dtos";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { RegisterUser , LoginUser , FindUserById } from "../../domain/use-cases";

export class AuthController {

    constructor(
        private readonly authRepository : AuthRepository,
        private readonly encrypter      : Encrypter,
        private readonly tokenManager   : TokenManager,
    ){}

    public registerUser = ( req : Request , res : Response ) => {
        const [ error , registerUserDto ] = RegisterUserDto.create( req.body );
        if( error ) return HandlerResponses.handleError( CustomError.badRequest( error ) , res );
        
        new RegisterUser( this.authRepository , this.encrypter , this.tokenManager )      
            .execute( registerUserDto! )
            .then( authResponse => HandlerResponses.handleAuthSuccess( res , authResponse , 201 ) )
            .catch( error => HandlerResponses.handleError(error,res) );  
    }

    public loginUser = ( req : Request , res : Response ) => {
        const [ error , loginUserDto ] = LoginUserDto.create( req.body );
        if( error ) return HandlerResponses.handleError( CustomError.badRequest( error ) , res );

        new LoginUser( this.authRepository , this.encrypter , this.tokenManager )
            .execute( loginUserDto! )
            .then( authResponse => HandlerResponses.handleAuthSuccess( res , authResponse , 200 ) )
            .catch( error => HandlerResponses.handleError(error , res ) );
    }

    public reloadToken = ( req : AuthenticatedRequest , res : Response ) => {

        const user = req.user;
        if( !user ) return HandlerResponses.handleError( CustomError.unauthorized('El usuario debe esar autenticado para refrescar el token.') , res );

        new FindUserById( this.authRepository )
            .execute( user.id )
            .then( async userResponse => {
                const payload = { id: user.id.toString() };
                const token = await this.tokenManager.generateToken( payload );
                if( !token ) return HandlerResponses.handleError( 'Hubo un error al generar el token', res );
                return HandlerResponses.handleAuthSuccess( res , { user: userResponse , token } );
            } )
            .catch( error => HandlerResponses.handleError( error , res ) );
    }

}