import { SingleUseTokenPurpose } from "../../entities/single-use-token.entity";
import { SingleUseTokenRepository } from "../../repository";
import { TokenManager } from "../../services";

interface SingleTokenUseIsValidUseCase {
    execute ( token : string , purpose : SingleUseTokenPurpose ) : Promise<boolean>;
}

export class SingleTokenUseIsValid implements SingleTokenUseIsValidUseCase {

    constructor(
        private readonly tokenManager : TokenManager,
        private readonly singleUseTokenRepository : SingleUseTokenRepository,
    ) {}

    async execute( token : string , purpose : SingleUseTokenPurpose ) : Promise<boolean> {
        const payload = await this.tokenManager.validateToken<{ email : string , jti : string }>( token );
        if( !payload?.email || !payload?.jti ) return false;

        const singleUseToken = await this.singleUseTokenRepository.findValidByJti( payload.jti , purpose );

        return !!singleUseToken;
    }
}
