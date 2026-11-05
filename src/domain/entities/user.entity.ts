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
    avatar_url ?: string,
    id_file ?: string,
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
    public avatar_url : string;
    public id_file : string;

    private constructor( options : UserEntityOptions ){
        const { id , first_name , last_name , email , isEmailVerified , role , password, balance, avatar_url, id_file } = options;
        this.id = id;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.isEmailVerified = isEmailVerified ?? false;
        this.role = role ?? 'student';
        this.password = password ?? null;
        this.balance = balance ?? 0;
        this.avatar_url = avatar_url ?? '';
        this.id_file = id_file ?? '';
    }

    static fromObject( object : { [ key : string ] : any } ) {
        const { id , first_name , last_name , email , isEmailVerified , role , password, balance, avatar_url, id_file } = object;

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
                avatar_url,
                id_file,
            }
        );
    }
}