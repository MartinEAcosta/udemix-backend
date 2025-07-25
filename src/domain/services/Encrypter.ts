

export abstract class Encrypter {

    abstract hash( password : string ) : string;
    abstract compare( password : string , hashed : string ) : boolean;

}