import { regularExps } from "../../helpers/regular.exp";


export class RegisterUserDto {

    private constructor(
        public readonly first_name : string,
        public readonly last_name : string,
        public readonly email : string,
        public readonly password : string | null
    ) { }

    static create ( props : { [key:string] : any } ) : [string? , RegisterUserDto?] {
        const { first_name , last_name , email , password = null } = props;

        if( !first_name ) return ['El nombre es requerido.', undefined];
        if( !last_name ) return ['El apellido es requerido.', undefined];
        if( !email ) return ['El email es requerido.', undefined];
        if( !regularExps.email.test( email ) ) return ['El email no es valido.', undefined];
        // if( !password ) return ['La contraseña es requerida.', undefined];
        // if( password.length < 6 ) return ['La longitud de la contraseña debe ser mayor a 6.', undefined];

        return [undefined, new RegisterUserDto( first_name, last_name, email, password)];
    }

}