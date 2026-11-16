import { ISingleUseTokenModel } from "../../data/mongo/models/single-use-token.model";
import { SingleUseTokenResponseDto } from "../../domain/dtos/auth/single-use-token.response.dto";

export class SingleUseTokenMapper {

    static fromSingleUseTokenResponseDto = ( tokenDoc : ISingleUseTokenModel ) : SingleUseTokenResponseDto => {
        return {
            id: tokenDoc._id.toString(),
            id_user: tokenDoc.id_user.toString(),
            jti: tokenDoc.jti,
            purpose: tokenDoc.purpose as SingleUseTokenResponseDto['purpose'],
            expires_at: tokenDoc.expires_at,
        };
    }

}
