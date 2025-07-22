

export class RegisterUserDto {

    private constructor(
        public readonly username : string,
        public readonly email : string,
        public readonly password : string
    ) { }

    static create ( props : {[key:string] : any }) : [string? , RegisterUserDto?] {
        const { username , email , password } = props;

        if( !username ) return ['El nombre de usuario es requerido.', undefined];
        if( !email ) return ['El email es requerido.', undefined];
        if( !password ) return ['La contraseña es requerida.', undefined];
        
        return [undefined, new RegisterUserDto( username, email, password)];
    }

}