import { SingleUseTokenEntity, SingleUseTokenPurpose } from '../entities/single-use-token.entity';

export abstract class SingleUseTokenRepository {

    abstract create( id_user : string , jti : string , purpose : SingleUseTokenPurpose , expires_at : Date ) : Promise<SingleUseTokenEntity>;
    abstract findValidByJti( jti : string , purpose : SingleUseTokenPurpose ) : Promise<SingleUseTokenEntity | null>;
    abstract consume( id : string ) : Promise<boolean>;

}
