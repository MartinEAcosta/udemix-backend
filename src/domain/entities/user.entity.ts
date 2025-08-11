import { CustomError } from "../errors/custom-error";

export interface UserEntityOptions {
    id : string,
    username : string,
    email : string,
    // emailValidated : boolean,
    password : string,
}

export class UserEntity implements UserEntityOptions {
    public id : string;
    public username : string;
    public email : string;
    //public  emailValidated : boolean;
    public password : string;

    constructor(
        options : UserEntityOptions,
    ){
        const { id , username , email , password} = options;
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }

    static fromObject( object : { [key:string]:any } ) {
        const { id , _id , username , email , password } = object;
        
        // Debido a que utilizamos mongoose y viene por defecto _id

        if( !username ) throw CustomError.badRequest('El nombre de usuario es requerido.'); 
        if( !email ) throw CustomError.badRequest('El email es requerido.');
        // if( !emailValidated === undefined ) throw CustomError.badRequest('');
        if( !password ) throw CustomError.badRequest('La contraseña es requerida.');

        return new UserEntity(
            { 
                id: _id || id, 
                username, 
                email, 
                password
            }
        );
    }   
}