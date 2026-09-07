import { CustomError } from "../errors/custom-error";

export interface UserEntityOptions {
    id : string,
    username : string,
    email : string,
    isEmailVerified : boolean,
    role : string;
    password : string,
    balance ?: number,
    avatar_url ?: string,
    id_file ?: string,
}

export class UserEntity {
    public id : string;
    public username : string;
    public email : string;
    public isEmailVerified : boolean;
    public role : string;
    public password : string;
    public balance : number;
    public avatar_url : string;
    public id_file : string;

    private constructor( options : UserEntityOptions ){
        const { id , username , email , isEmailVerified , role , password, balance, avatar_url, id_file } = options;
        this.id = id;
        this.username = username;
        this.email = email;
        this.isEmailVerified = isEmailVerified ?? false;
        this.role = role ?? 'student';
        this.password = password;
        this.balance = balance ?? 0;
        this.avatar_url = avatar_url ?? '';
        this.id_file = id_file ?? '';
    }

    static fromObject( object : { [ key : string ] : any } ) {
        const { id , username , email , isEmailVerified , role , password, balance, avatar_url, id_file } = object;
        
        if( !username ) throw CustomError.badRequest('El nombre de usuario es requerido.'); 
        if( !email ) throw CustomError.badRequest('El email es requerido.');
        if( !password ) throw CustomError.badRequest('La contraseña es requerida.');

        return new UserEntity(
            { 
                id: id, 
                username, 
                email, 
                isEmailVerified,
                role,
                password,
                balance,
                avatar_url
            }
        );
    }   
}