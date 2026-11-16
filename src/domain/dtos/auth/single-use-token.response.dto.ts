import { SingleUseTokenPurpose } from '../../entities/single-use-token.entity';

export interface SingleUseTokenResponseDto {
    id         : string;
    id_user    : string;
    jti        : string;
    purpose    : SingleUseTokenPurpose;
    expires_at : Date;
}
