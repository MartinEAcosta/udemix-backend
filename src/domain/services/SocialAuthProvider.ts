import { SocialLoginResponseDto } from "../dtos/auth/auth.responses.dto";


export abstract class SocialAuthProvider {

    abstract verifyToken( token : string ) : Promise<SocialLoginResponseDto>;
}