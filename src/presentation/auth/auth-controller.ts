import { Request, Response } from "express";
import { RegisterUserDto } from "../../domain/dtos/auth/register-user-dto";
import { RegisterUser } from "../../domain/use-cases/auth/register-user";
import { AuthRepository } from "../../domain/repository/auth-repository";
import { CustomError } from "../../domain/errors/custom-error";


export class AuthController {

    constructor(
        private readonly authRepository : AuthRepository,
    ){}

    private handleError = ( error : unknown , res : Response) => {
        if( error instanceof CustomError ) {
            return res.status( error.statusCode ).json({
                error: error.message,
            });
        }

        console.log( error );
        return res.status(500).json({
            error: 'Internal Server Error',
        });
    }

    registerUser = ( req : Request , res : Response ) => {
        const [ error , registerUserDto ] = RegisterUserDto.create( req.body );
        if( error ) return res.status(400).json({
            error : error,
        });

        new RegisterUser( this.authRepository )      
            .execute( registerUserDto! )
            .then( userResponse => res.status(201).json( userResponse ))
            .catch( error => this.handleError(error,res) );  
    }

    loginUser = ( req : Request , res : Response ) => {
        throw 'login';
    }

    reloadToken = ( req : Request , res : Response ) => {
        throw 'reload';
    }
}