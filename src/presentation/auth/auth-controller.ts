import { Request, Response } from "express";


export class AuthController {


    constructor(){}

    registerUser = ( req : Request , res : Response ) => {
        throw 'register';
    }

    loginUser = ( req : Request , res : Response ) => {
        throw 'login';
    }

    reloadToken = ( req : Request , res : Response ) => {
        throw 'reload';
    }
}