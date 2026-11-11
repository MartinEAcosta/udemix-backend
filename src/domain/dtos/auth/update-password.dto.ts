
export class UpdatePasswordDto {

    private constructor(
        public readonly id : string,
        public readonly current_password : string,
        public readonly new_password : string,
    ) { }

    static create ( props : { [key:string] : any } ) : [string? , UpdatePasswordDto?] {
        const { id , current_password , new_password } = props;

        if( !id ) return ['El ID es requerido.' , undefined];
        if( !current_password ) return ['La contraseña actual es requerida.' , undefined];
        if( !new_password ) return ['La nueva contraseña es requerida.' , undefined];
        if( new_password.length < 6 ) return ['La longitud de la nueva contraseña debe ser mayor a 6.' , undefined];

        return [undefined, new UpdatePasswordDto( id , current_password , new_password )];
    }
}