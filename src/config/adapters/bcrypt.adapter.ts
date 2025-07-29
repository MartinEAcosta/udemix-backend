import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { Encrypter } from '../../domain/services/Encrypter';
export class BcryptAdapter implements Encrypter {

    hash = ( password : string ) : string => {
        const salt = genSaltSync();

        return hashSync( password , salt );
    }

    compare = ( password : string , hashed : string ) : boolean => {
        return compareSync( password , hashed );
    }

}