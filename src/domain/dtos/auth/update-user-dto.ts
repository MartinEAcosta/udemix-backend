import { regularExps } from "../../helpers/regular.exp";

export class UpdateUserDto {

    private constructor(
        public readonly id : string,
        public readonly username ?: string,
        public readonly email ?: string,
        public readonly password ?: string,
        public readonly isEmailVerified ?: boolean,
        public readonly avatar_url ?: string | null,
        public readonly id_file ?: string | null
    ) { }

    
    static create ( props : { [key:string] : any } ) : [string? , UpdateUserDto?] {
        const { id, username , email , password , isEmailVerified, avatar_url , id_file } = props;

        if( !id ) return ['El ID es requerido.', undefined];
        if( email && !regularExps.email.test( email ) ) return ['El email no es valido.', undefined];
        if( password && password.length < 6 ) return ['La longitud de la contraseña debe ser mayor a 6.', undefined];

        return [undefined, new UpdateUserDto( id, username, email, password, isEmailVerified, avatar_url, id_file )];
    }
}

