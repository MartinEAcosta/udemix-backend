import { CustomError } from "../errors/custom-error";

export interface UserEntityOptions {
    id : string,
    username : string,
    email : string,
    // emailValidated : boolean,
    password : string,
}


export class UserEntity implements UserEntityOptions {

    constructor(
        public id : string,
        public username : string,
        public email : string,
        // public emailValidated,
        public password : string,
    ){}

    static fromObject( object : { [key:string]:any } ) {
        const { id , _id , username , email , password } = object;
        
        // Debido a que utilizamos mongoose y viene por defecto _id
        if( !id && !_id ) throw CustomError.badRequest('El id es requerido.');

        if( !username ) throw CustomError.badRequest('El nombre de usuario es requerido.'); 
        if( !email ) throw CustomError.badRequest('El email es requerido.');
        // if( !emailValidated === undefined ) throw CustomError.badRequest('');
        if( !password ) throw CustomError.badRequest('La contraseña es requerida.');

        return new UserEntity( _id || id , username , email , password );
    }   
}