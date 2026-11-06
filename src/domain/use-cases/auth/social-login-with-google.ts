import { SocialAuthProvider } from "../../services/SocialAuthProvider";
import { SocialLoginResponseDto } from '../../dtos/auth/auth.responses.dto';
import { TokenManager } from "../../services";
import { AuthRepository } from "../../repository";
import { RegisterUserDto } from "../../dtos";
import { CustomError } from "../../errors/custom-error";

interface SocialLoginWithGoogleUseCase {
    execute( token : string ) : Promise<SocialLoginResponseDto>;
}

export class SocialLoginWithGoogle implements SocialLoginWithGoogleUseCase {

    constructor(
        private readonly socialAuth : SocialAuthProvider,
        private readonly tokenManager : TokenManager,
        private readonly authRepository : AuthRepository,
    ) {}

    async execute( token : string ) : Promise<SocialLoginResponseDto> {
        const socialResponseData = await this.socialAuth.verifyToken( token );
        
        if( !socialResponseData || !socialResponseData.user || !socialResponseData.token ) {
            throw CustomError.badRequest('Invalid social login response data');
        }
        let userExists = await this.authRepository.findUserByEmail( socialResponseData.user.email );
        if( !userExists ) {
            const [ error , userDto ] = RegisterUserDto.create({
                first_name : socialResponseData.user.first_name,
                last_name : socialResponseData.user.last_name,
                email : socialResponseData.user.email,
                isEmailVerified : socialResponseData.user.isEmailVerified,
            });
            if( error ) throw CustomError.badRequest('Error creating user');
            const newUser = await this.authRepository.registerUser( userDto! );
            userExists = newUser;
        }

        console.log('User exists:', userExists);
        
        const x_token = await this.tokenManager.generateToken({
            id : userExists?.id || '',
            email : socialResponseData.user.email,
            isEmailVerified : userExists?.isEmailVerified || false,
            role : userExists?.role || 'student',
        });
        if( !x_token ) throw CustomError.internalServer('Error while generating token');
        

        return {
            user : {
                id : userExists?.id || '',
                first_name : userExists?.first_name || '',
                last_name : userExists?.last_name || '',
                email : userExists?.email || '',
                role : userExists?.role || 'student',
                isEmailVerified : userExists?.isEmailVerified || false,
                avatar_url : userExists?.avatar_url ?? null,
            },
            token : x_token,
            provider : 'google',
        };
    }

}