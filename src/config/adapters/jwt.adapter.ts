import jwt, { SignOptions } from 'jsonwebtoken';
import { envs } from '../envs';
import { TokenManager } from '../../domain/services/TokenManager';

const JWT_SEED = envs.SECRET_JWT_SEED;
export class JwtAdapter implements TokenManager{

    generateToken = ( payload : { id : string , email : string , isEmailVerified ?: boolean, role ?: string }  , duration : string = '2h' ) : Promise<string | null> => {
        
        return new Promise( (resolve)  => {

            const completePayload = {
                isEmailVerified : false,
                role            : 'student',
                ...payload,
            }


            jwt.sign( completePayload , JWT_SEED!  , { expiresIn: duration } as SignOptions , 
                ( error , token ) => {
                    if( error ){
                        console.log(error);
                        return resolve(null);
                    }

                    return resolve(token!);
                }
            )
        });
    }

    validateToken = <T>( token : string ) : Promise<T | null> => {
        return new Promise( (resolve) => {
            jwt.verify( token , JWT_SEED! , (err , decoded) => {
                if( err ) return resolve(null);

                resolve(decoded as T);
            })
        });
    }

}