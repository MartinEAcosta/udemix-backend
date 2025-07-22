import { regularExps } from "../../../config";


export class RegisterUserDto {

    private constructor(
        public readonly username : string,
        public readonly email : string,
        public readonly password : string
    ) { }

    static create ( props : { [key:string] : any } ) : [string? , RegisterUserDto?] {
        const { username , email , password } = props;

        if( !username ) return ['El nombre de usuario es requerido.', undefined];
        if( !email ) return ['El email es requerido.', undefined];
        if( !regularExps.email.test( email ) ) return ['El email no es valido.', undefined];
        if( !password ) return ['La contraseña es requerida.', undefined];
        if( password.length < 6 ) return ['La longitud de la contraseña debe ser mayor a 6.'];
        
        return [undefined, new RegisterUserDto( username, email, password)];
    }

}