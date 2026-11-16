import { CustomError } from "../errors/custom-error";

export type SingleUseTokenPurpose = 'password_reset' | 'email_verification';

interface SingleUseTokenOptions {
    id         : string;
    id_user    : string;
    jti        : string;
    purpose    : SingleUseTokenPurpose;
    expires_at : Date;
}

export class SingleUseTokenEntity {

    public id         : string;
    public id_user    : string;
    public jti        : string;
    public purpose    : SingleUseTokenPurpose;
    public expires_at : Date;

    private constructor( options : SingleUseTokenOptions ) {
        const { id , id_user , jti , purpose , expires_at } = options;
        this.id = id;
        this.id_user = id_user;
        this.jti = jti;
        this.purpose = purpose;
        this.expires_at = expires_at;
    }

    static fromObject( object : { [ key : string ] : any } ) {
        const { id , id_user , jti , purpose , expires_at } = object;

        if( !id_user ) throw CustomError.badRequest('El id_user del token es requerido.');
        if( !jti ) throw CustomError.badRequest('El jti del token es requerido.');
        if( !purpose ) throw CustomError.badRequest('El purpose del token es requerido.');
        if( !expires_at ) throw CustomError.badRequest('La fecha de expiración del token es requerida.');

        return new SingleUseTokenEntity({ id , id_user , jti , purpose , expires_at });
    }

}
