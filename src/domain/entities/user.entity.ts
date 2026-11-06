import { CustomError } from "../errors/custom-error";

export interface UserEntityOptions {
    id : string,
    first_name : string,
    last_name : string,
    email : string,
    isEmailVerified : boolean,
    role : string;
    password ?: string | null,
    balance ?: number,
    id_file ?: string,
    avatar_url ?: string | null,
}

export class UserEntity {
    public id : string;
    public first_name : string;
    public last_name : string;
    public email : string;
    public isEmailVerified : boolean;
    public role : string;
    public password : string | null;
    public balance : number;
    public id_file : string;
    public avatar_url : string | null;

    private constructor( options : UserEntityOptions ){
        const { id , first_name , last_name , email , isEmailVerified , role , password, balance, id_file, avatar_url } = options;
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.isEmailVerified = isEmailVerified ?? false;
        this.role = role ?? 'student';
        this.password = password ?? null;
        this.balance = balance ?? 0;
        this.id_file = id_file ?? '';
        this.avatar_url = avatar_url ?? null;
    }

    static fromObject( object : { [ key : string ] : any } ) {
        const { id , first_name , last_name , email , isEmailVerified , role , password, balance, id_file, avatar_url } = object;

        if( !first_name ) throw CustomError.badRequest('El nombre es requerido.');
        if( !last_name ) throw CustomError.badRequest('El apellido es requerido.');
        if( !email ) throw CustomError.badRequest('El email es requerido.');

        return new UserEntity(
            {
                id: id,
                first_name,
                last_name,
                email,
                isEmailVerified,
                role,
                password,
                balance,
                id_file,
                avatar_url,
            }
        );
    }
}