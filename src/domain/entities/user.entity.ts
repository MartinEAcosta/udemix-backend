import { CustomError } from "../errors/custom-error";

export interface UserEntityOptions {
    id : string,
    username : string,
    email : string,
    // emailValidated : boolean,
    password : string,
    balance ?: number,
}

export class UserEntity implements UserEntityOptions {
    public id : string;
    public username : string;
    public email : string;
    //public  emailValidated : boolean;
    public password : string;
    public balance : number;

    private constructor( options : UserEntityOptions ){
        const { id , username , email , password, balance } = options;
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.balance = balance ?? 0;
    }

    static fromObject( object : { [ key : string ] : any } ) {
        const { id , _id , username , email , password, balance } = object;
        
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
                password,
                balance,
            }
        );
    }   
}