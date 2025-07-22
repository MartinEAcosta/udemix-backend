import { Request, Response } from "express";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user-dto";
import { RegisterUser } from "../../domain/use-cases/auth/register-user";
import { AuthRepository } from "../../domain/repository/auth-repository";


export class AuthController {

    constructor(
        private readonly authRepository : AuthRepository,
    ){}

    registerUser = ( req : Request , res : Response ) => {
        new RegisterUser(this.authRepository )      
            .execute( req.body )
            .then( userResponse => res.status(200).json({ user: userResponse }))
            .catch( error => res.json({error}));  
    }

    loginUser = ( req : Request , res : Response ) => {
        throw 'login';
    }

    reloadToken = ( req : Request , res : Response ) => {
        throw 'reload';
    }
}