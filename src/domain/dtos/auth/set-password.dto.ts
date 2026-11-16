
export class SetPasswordDto {

    private constructor(
        public readonly id : string,
        public readonly new_password : string,
    ) { }

    static create ( props : { [key:string] : any } ) : [string? , SetPasswordDto?] {
        const { id , new_password } = props;

        if( !id ) return ['El ID es requerido.' , undefined];
        if( !new_password ) return ['La nueva contraseña es requerida.' , undefined];
        if( new_password.length < 6 ) return ['La longitud de la nueva contraseña debe ser mayor a 6.' , undefined];

        return [undefined, new SetPasswordDto( id , new_password )];
    }
}
