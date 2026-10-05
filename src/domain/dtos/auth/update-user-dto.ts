import { regularExps } from "../../helpers/regular.exp";

export class UpdateUserDto {

    private constructor(
        public readonly id : string,
        public readonly username ?: string,
        public readonly email ?: string,
        public readonly password ?: string,
        public readonly avatar_url ?: string | null,
        public readonly id_file ?: string | null,
        public readonly isEmailVerified ?: boolean,
    ) { }

    // Construido solo a partir de req.body: isEmailVerified nunca se lee del input del usuario,
    // así se evita que un usuario se autoverifique el email por esta vía.
    static create ( props : { [key:string] : any } ) : [string? , UpdateUserDto?] {
        const { id, username , email , password , avatar_url , id_file = null } = props;

        if( !id ) return ['El ID es requerido.', undefined];
        if( email && !regularExps.email.test( email ) ) return ['El email no es valido.', undefined];
        if( password && password.length < 6 ) return ['La longitud de la contraseña debe ser mayor a 6.', undefined];

        return [undefined, new UpdateUserDto( id, username, email, password, avatar_url, id_file )];
    }

    // Uso interno (ej. ValidateEmail) para marcar el email como verificado tras validar el token.
    static markEmailVerified ( id : string , isEmailVerified : boolean ) : UpdateUserDto {
        return new UpdateUserDto( id, undefined, undefined, undefined, undefined, undefined, isEmailVerified );
    }
}

