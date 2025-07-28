import { NextFunction, Request, Response } from "express";
import { TokenManager } from "../../domain/services/TokenManager";
import { AuthRepository } from "../../domain/repository/auth-repository";
import { UserEntity } from "../../domain/entities/user.entity";


export class AuthMiddleware {

    constructor( private readonly tokenManager : TokenManager,
                private readonly authRepository : AuthRepository,
     ) {}

    validateJWT = async( req : Request , res : Response , next : NextFunction ) : Promise<void> => {
        
        const authorization = req.header('Authorization');
        console.log(authorization);
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

            const payload = await this.tokenManager.validateToken<{id: string}>( token );
            if( !payload ) {
                res.status(401).json({ error: 'El token invalido.'})
                return;
            }

            const user = await this.authRepository.searchUserById( payload.id );
            if( !user ) {
                res.status(400).json({ error: 'El usuario no existe.' });
                return;
            }
            console.log(user);

            (req as Request & { user?: UserEntity }).user = user;
            next();
        }
        catch(error){
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error'});
            return;
        }
    }
    
}