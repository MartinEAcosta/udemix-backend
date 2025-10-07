import { NextFunction, Request, Response } from "express";
import { TokenManager } from "../../domain/services/TokenManager";
import { AuthRepository } from "../../domain/repository/auth-repository";
import { UserEntity } from "../../domain/entities/user.entity";

export interface AuthenticatedRequest extends Request {
    user?: UserEntity;
}

export class AuthMiddleware {

    constructor( private readonly tokenManager : TokenManager,
                private readonly authRepository : AuthRepository,
     ) {}

    validateJWT = async( req : AuthenticatedRequest , res : Response , next : NextFunction ) : Promise<void> => {
        const authorization = req.header('Authorization');
        if( !authorization ) {
            res.status(401).json({ error: 'No hay token en la petición.'});
            return;
        }
        if( !authorization.startsWith('Bearer ') ) {
             res.status(401).json({ error: 'El token es invalido.' });
             return;
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
                res.status(401).json({ error: 'El token invalido.'})
                return;
            }

            const user = await this.authRepository.findUserById( payload.id );
            if( !user ) {
                res.status(400).json({ error: 'El usuario no existe.' });
                return;
            }

            req.user = user;
            next();
        }
        catch(error){
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error'});
            return;
        }
    }

    validateAndAssignOwner = ( req : AuthenticatedRequest , res : Response , next : NextFunction ) => {
        const user = req.user;

        if(!user) {
            res.status(401).json({ 
                ok : false,
                error : 'Hubo un error al recopilar el usuario.'
            });
            return;
        }

        req.body = { 
                    ...req.body,
                    id_owner: user.id,
                   };

        next();
    }

}