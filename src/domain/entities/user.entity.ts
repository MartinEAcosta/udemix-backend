import { CustomError } from "../errors/custom-error";

export interface UserEntityOptions {
    id : string,
    username : string,
    email : string,
    // emailValidated : boolean,
    password : string,
    balance ?: number,
    enrolledCourses  ?: string[],
}

export class UserEntity implements UserEntityOptions {
    public id : string;
    public username : string;
    public email : string;
    //public  emailValidated : boolean;
    public password : string;
    public balance : number;
    public enrolledCourses : string[];

    private constructor( options : UserEntityOptions ){
        const { id , username , email , password, balance, enrolledCourses} = options;
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.balance = balance || 0;
        this.enrolledCourses = enrolledCourses || [];
    }

    static fromObject( object : { [ key : string ] : any } ) {
        const { id , _id , username , email , password, balance, enrolledCourses } = object;
        
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
                enrolledCourses,
            }
        );
    }   
}