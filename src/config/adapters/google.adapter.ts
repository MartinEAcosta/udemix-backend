import { OAuth2Client } from 'google-auth-library';
import { envs } from '../envs';

import { SocialAuthProvider } from '../../domain/services/SocialAuthProvider';
import { SocialLoginResponseDto } from '../../domain/dtos/auth/auth.responses.dto';

interface TokenPayload {
    iss : string;
    azp ?: string;
    aud : string;
    sub : string;
    email ?: string;
    email_verified ?: boolean;
    at_hash ?: string;
    name ?: string;
    picture ?: string;
    given_name ?: string;
    family_name ?: string;
    iat : number;
    exp : number;
}

export class GoogleAdapter implements SocialAuthProvider {

    private readonly client : OAuth2Client;
    private readonly WEB_CLIENT_ID : string = envs.GOOGLE_AUTH_CLIENT_ID || '';
    private readonly WEB_CLIENT_SECRET : string = envs.GOOGLE_AUTH_SECRET || '';

    constructor( clientId : string ) {
        this.client = new OAuth2Client( clientId , this.WEB_CLIENT_SECRET, 'postmessage' );
    }

    async verifyToken( token : string ) : Promise<SocialLoginResponseDto> {
        try{
            const { tokens } = await this.client.getToken(token);
            const ticket = await this.client.verifyIdToken({
                idToken: tokens.id_token!,
                audience: this.WEB_CLIENT_ID,  
                // Specify the WEB_CLIENT_ID of the app that accesses the backend
                // Or, if multiple clients access the backend:
                //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
            });
            const payload = ticket.getPayload();
            if( payload === undefined ) throw new Error('Invalid Google token: payload is undefined');

            return { 
                user: {
                    ...this.resolveNames(payload),
                    email: payload.email ?? '',
                    isEmailVerified: payload.email_verified ?? false,
                    role:   'student',
                    avatar_url: null,
                },
                token: tokens.id_token ?? '',
                provider: 'google'
            };
        }
        catch( error ) {
            console.error( 'Error verifying Google token:', error );
            throw new Error( 'Invalid Google token' );
        }
    }

    private resolveNames(payload: TokenPayload) {
        let first = payload.given_name?.trim() ?? '';
        let last  = payload.family_name?.trim() ?? '';

        if (!first && payload.name) {
            const [head, ...tail] = payload.name.trim().split(/\s+/);
            first = head;
            last  = last || tail.join(' ');
        }

        if (!first && payload.email) {
            first = payload.email.split('@')[0];
        }

        return { first_name: first || 'Usuario', last_name: last };
        // * NUNCA DEBERIA PASAR DE TENER UN NOMBRE 'Usuario', pero por las dudas queda un default.
    }

}