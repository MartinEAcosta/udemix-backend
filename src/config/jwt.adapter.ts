import jwt from 'jsonwebtoken';
import { envs } from './envs';

export class JwtAdapter {

    static generateJwt = ( _id : string , email : string ) => {
        
        return new Promise( ( resolve , reject )  => {

            const payload = { _id , email };

            jwt.sign( payload , envs.SECRET_JWT_SEED! , {
                expiresIn : '1h'
            }, ( error , token ) => {
                if( error ){
                    console.log(error);
                    reject('Hubo un error al generar el token.');
                }

                resolve(token);
            })
        });
    }
}