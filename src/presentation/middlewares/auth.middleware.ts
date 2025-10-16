import { NextFunction, Request, Response } from "express";
import { TokenManager } from "../../domain/services/TokenManager";
import { AuthRepository } from "../../domain/repository/auth-repository";
import { UserEntity } from "../../domain/entities/user.entity";
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";

export interface AuthenticatedRequest extends Request {
    user?: UserEntity;
}

export class AuthMiddleware {

    constructor( private readonly tokenManager : TokenManager,
                private readonly authRepository : AuthRepository,
     ) {}

    validateJWT = async( req : AuthenticatedRequest , res : Response , next : NextFunction ) => {
        const authorization = req.header('Authorization');
        if( !authorization ) {
            return HandlerResponses.handleError( CustomError.unauthorized('No hay token en la petición') , res );
        }
        if( !authorization.startsWith('Bearer ') ) {
            return HandlerResponses.handleError( CustomError.unauthorized('El token ingresado es invalido.') , res );
        }

        const token = authorization.split(' ')[1] || '';

        try{

            // ** Chequeear si es necesario todos los atributos, debido a que hay algunos que no se usan
            const payload = await this.tokenManager.validateToken<
                                                                    {
                                                                        id              : string,
                                                                        email           : string,
                                                                        isEmailVerified : boolean,
                                                                        role            : string,
                                                                    }>( token );
            if( !payload ) {
                return HandlerResponses.handleError( CustomError.unauthorized('El token ingresado es invalido.') , res );
            }

            const user = await this.authRepository.findUserById( payload.id );
            if( !user ) {
                return HandlerResponses.handleError( CustomError.notFound('Revise las credenciales e intente nuevamente.') , res );
            }

            req.user = user;
            next();
        }
        catch(error){
            console.log(error);
            return HandlerResponses.handleError( CustomError.internalServer('Hubo un error inesperado al validar el token') , res );
        }
    }

    validateAndAssignOwner = ( req : AuthenticatedRequest , res : Response , next : NextFunction ) => {
        const user = req.user;

        if(!user) {
            return HandlerResponses.handleError( CustomError.notFound( 'Hubo un error al recopilar el usuario.' ) , res );
        }

        req.body = { 
                    ...req.body,
                    id_owner: user.id,
                   };

        next();
    }

    validatePermissions = ( roles : string[] ) => {
        return ( req : AuthenticatedRequest , res : Response , next : NextFunction ) => {
            const user = req.user;

            if( !user ) return HandlerResponses.handleError( CustomError.unauthorized('Es necesario estar autenticado para realizar esta acción.') , res );

            if( !roles.includes( user.role ) ) return HandlerResponses.handleError( CustomError.forbidden('No tienes permisos para realizar esta acción.') , res );
        
            next();
        }
    }

}