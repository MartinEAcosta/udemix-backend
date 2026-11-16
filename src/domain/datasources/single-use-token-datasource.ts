import { SingleUseTokenPurpose } from '../entities/single-use-token.entity';
import { SingleUseTokenResponseDto } from '../dtos/auth/single-use-token.response.dto';

export abstract class SingleUseTokenDatasource {

    abstract create( id_user : string , jti : string , purpose : SingleUseTokenPurpose , expires_at : Date ) : Promise<SingleUseTokenResponseDto>;
    abstract findValidByJti( jti : string , purpose : SingleUseTokenPurpose ) : Promise<SingleUseTokenResponseDto | null>;
    abstract consume( id : string ) : Promise<boolean>;

}
