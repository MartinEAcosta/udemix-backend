import { regularExps } from "../../../config";

export class LoginUserDto {

    private constructor(
        public readonly email : string,
        public readonly password : string
    ) { }

    static create ( props : { [key:string] : any } ) : [string? , LoginUserDto?] {
        const { email , password } = props;

        if( !email ) return ['El email es requerido.', undefined];
        if( !regularExps.email.test( email ) ) return ['El email no es valido.', undefined];
        if( !password ) return ['La contraseña es requerida.', undefined];
        if( password.length < 6 ) return ['La longitud de la contraseña debe ser mayor a 6.'];
        
        return [undefined, new LoginUserDto( email, password)];
    }

}