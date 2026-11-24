import { regularExps } from "../../helpers/regular.exp";

export class UpdateUserDto {

    private constructor(
        public readonly id : string,
        public readonly first_name ?: string,
        public readonly last_name ?: string,
        public readonly email ?: string,
        public readonly password ?: string | null,
        public readonly isEmailVerified ?: boolean,
        public readonly balance ?: number,
    ) { }

    // Construido solo a partir de req.body. Los campos que NO figuran acá no se leen del input
    // del usuario a propósito:
    //  - isEmailVerified: evita que alguien se autoverifique el email por esta vía.
    //  - balance: sólo lo mueve el flujo de inscripción, vía el factory balanceUpdate.
    //  - id_file / avatar_url: sólo los escribe AuthDatasource.updateUserAvatar. Cuando id_file
    //    se leía de acá con default null, cada actualización de perfil le borraba el avatar al
    //    usuario, y permitía apuntar el FK al File de otra persona.
    static create ( props : { [key:string] : any } ) : [string? , UpdateUserDto?] {
        const { id, first_name , last_name , email , password } = props;

        if( !id ) return ['El ID es requerido.', undefined];
        if( email && !regularExps.email.test( email ) ) return ['El email no es valido.', undefined];
        if( password && password.length < 6 ) return ['La longitud de la contraseña debe ser mayor a 6.', undefined];

        return [undefined, new UpdateUserDto( id, first_name, last_name, email, password )];
    }

    // Uso interno (ej. ValidateEmail) para marcar el email como verificado tras validar el token.
    static markEmailVerified ( id : string , isEmailVerified : boolean ) : UpdateUserDto {
        return new UpdateUserDto( id, undefined, undefined, undefined, undefined, isEmailVerified );
    }

    // Uso interno (social login): reclama una cuenta plantada/no verificada, anulando
    // cualquier password previo ya que el dueño real recién se verificó vía Google.
    static reclaimUnverifiedAccount ( id : string ) : UpdateUserDto {
        return new UpdateUserDto( id, undefined, undefined, undefined, null, true );
    }

    // Uso interno (EnrollUserInCourse): debita el saldo del alumno. Antes el balance llegaba
    // spreadeando la UserEntity completa dentro de updateUser, lo que arrastraba de rebote todos
    // los demás campos del usuario — incluidos id_file y avatar_url.
    static balanceUpdate ( id : string , balance : number ) : UpdateUserDto {
        return new UpdateUserDto( id, undefined, undefined, undefined, undefined, undefined, balance );
    }

    // Uso interno (UpdateUser): deriva el DTO a persistir del que llegó del body, reemplazando
    // la password en claro por su hash y, si cambió el email, marcándolo como no verificado.
    // Existe para que el use-case no spreadee el DTO a un objeto plano.
    static withProfileChanges (
        base : UpdateUserDto,
        changes : { hashedPassword ?: string , unverifyEmail ?: boolean },
    ) : UpdateUserDto {
        return new UpdateUserDto(
            base.id,
            base.first_name,
            base.last_name,
            base.email,
            // ?? y no ||: base.password puede ser null a propósito (reclaimUnverifiedAccount).
            changes.hashedPassword ?? base.password,
            changes.unverifyEmail ? false : base.isEmailVerified,
            base.balance,
        );
    }
}

