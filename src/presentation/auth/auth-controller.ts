import { Request, Response } from "express";

import { AuthRepository } from "../../domain/repository/auth-repository";
import { Encrypter } from "../../domain/services/Encrypter";
import { TokenManager } from "../../domain/services/TokenManager";
import { CustomError } from "../../domain/errors/custom-error";
import { HandlerResponses } from '../helpers/handler-responses';

import { RegisterUserDto , LoginUserDto } from "../../domain/dtos";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { RegisterUser , LoginUser } from "../../domain/use-cases";
import { ReloadToken } from "../../domain/use-cases/auth/reload-token";
import { UpdateUser } from "../../domain/use-cases/auth/update-user";
import { UpdateUserDto } from "../../domain/dtos/auth/update-user-dto";
import { SocialLoginWithGoogle } from "../../domain/use-cases/auth/social-login-with-google";
import { SocialAuthProvider } from "../../domain/services/SocialAuthProvider";
import { UpdatePasswordDto } from "../../domain/dtos/auth/update-password.dto";
import { UpdatePassword } from "../../domain/use-cases/auth/update-password";
import { SetPasswordDto } from "../../domain/dtos/auth/set-password.dto";
import { SetPassword } from "../../domain/use-cases/auth/set-password";

export class AuthController {

    constructor(
        private readonly authRepository : AuthRepository,
        private readonly encrypter      : Encrypter,
        private readonly tokenManager   : TokenManager,
        private readonly socialAuth : SocialAuthProvider,
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

    public loginWithGoogle = ( req : Request , res : Response ) => {
        const { code } = req.body;

        new SocialLoginWithGoogle( this.socialAuth , this.tokenManager , this.authRepository )
            .execute( code )
            .then( authResponse => HandlerResponses.handleAuthSuccess( res , authResponse , 200 ) )
            .catch( error => HandlerResponses.handleError(error , res ) );
    }

    public updateUser = ( req : AuthenticatedRequest , res : Response ) => {
        const userId = req.params.id as string | undefined;
        const user = req.user;
        if( !user ) return HandlerResponses.handleError( CustomError.unauthorized('El usuario debe esar autenticado para actualizar su perfil.') , res );
        const targetId = userId ?? user?.id;

        if( user.id !== targetId && user.role !== 'admin' ) return HandlerResponses.handleError( CustomError.forbidden('No tienes permisos para actualizar este perfil.') , res );

        const [ error , userDto ] = UpdateUserDto.create( {...req.body, id: targetId} );
        if( error ) return HandlerResponses.handleError( CustomError.badRequest( error ) , res );

        new UpdateUser( this.authRepository , this.tokenManager, this.encrypter )
            .execute( userDto! )
            .then( updatedUser => HandlerResponses.handleAuthSuccess( res , updatedUser , 200 ) )
            .catch( error => HandlerResponses.handleError( error , res ) );
    }

    public reloadToken = ( req : AuthenticatedRequest , res : Response ) => {

        const user = req.user;
        if( !user ) return HandlerResponses.handleError( CustomError.unauthorized('El usuario debe esar autenticado para refrescar el token.') , res );

        new ReloadToken( this.authRepository, this.tokenManager )
            .execute( user.id )
            .then( authResponse => HandlerResponses.handleAuthSuccess( res, authResponse , 200) )
            .catch( error => HandlerResponses.handleError( error , res ) );
    }

    public updatePassword = ( req : AuthenticatedRequest , res : Response ) => {
        const user = req.user;
        if( !user ) return HandlerResponses.handleError( CustomError.unauthorized('El usuario debe esar autenticado para actualizar su contraseña.') , res );
    
        const { currentPassword , newPassword } = req.body;
        const [ error , updatePasswordDto ] = UpdatePasswordDto.create( { id: user.id, current_password: currentPassword, new_password: newPassword } );
        if( error ) return HandlerResponses.handleError( CustomError.badRequest( error ) , res );

        new UpdatePassword( this.authRepository , this.tokenManager , this.encrypter )
            .execute( updatePasswordDto! )
            .then( updatedUser => HandlerResponses.handleAuthSuccess( res , updatedUser , 200 ) )
            .catch( error => HandlerResponses.handleError( error , res ) );
    }

    public setPassword = ( req : AuthenticatedRequest , res : Response ) => {
        const user = req.user;
        if( !user ) return HandlerResponses.handleError( CustomError.unauthorized('El usuario debe esar autenticado para establecer su contraseña.') , res );

        const { newPassword } = req.body;
        const [ error , setPasswordDto ] = SetPasswordDto.create( { id: user.id, new_password: newPassword } );
        if( error ) return HandlerResponses.handleError( CustomError.badRequest( error ) , res );

        new SetPassword( this.authRepository , this.tokenManager , this.encrypter )
            .execute( setPasswordDto! )
            .then( updatedUser => HandlerResponses.handleAuthSuccess( res , updatedUser , 200 ) )
            .catch( error => HandlerResponses.handleError( error , res ) );
    }


}