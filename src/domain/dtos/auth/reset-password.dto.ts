
export class ResetPasswordDto {

    private constructor(
        public readonly token : string,
        public readonly password : string,
    ) { }

    static create ( props : { [key:string] : any } ) : [string? , ResetPasswordDto?] {
        const { token , password } = props;

        if( !token ) return ['El token es requerido.' , undefined];
        if( !password ) return ['La contraseña es requerida.' , undefined];
        if( password.length < 6 ) return ['La longitud de la contraseña debe ser mayor a 6.' , undefined];

        return [undefined, new ResetPasswordDto( token , password )];
    }
}
