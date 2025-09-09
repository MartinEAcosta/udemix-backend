import { Response } from "express";
import { CustomError } from "../../domain/errors/custom-error";
import { AuthSuccessResponseDto } from "../../domain/dtos/auth/auth.responses.dto";


export class HandlerResponses {

    static handleError = ( error : unknown , res : Response) => {
        if( error instanceof CustomError ) {
            return res.status( error.statusCode ).json({
                ok: false,
                error: error.message,
            });
        }

        console.log( error );
        return res.status(500).json({
            error: 'Internal Server Error',
        });
    }

    static handleSuccess = ( res : Response , data : unknown , statusCode : number = 200  ) => {
        return res.status(statusCode).json({
            ok   : true,
            data : data,
        });
    }

    static handleAuthSuccess = ( res : Response , authResponse : AuthSuccessResponseDto , statusCode : number = 200 ) => {
        return res.status(statusCode).json({
            ok: true,
            user: authResponse.user,
            token: authResponse.token,
        });
    }
}