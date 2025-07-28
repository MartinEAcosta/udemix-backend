

export abstract class TokenManager { 

    abstract generateToken( payload : any , duration? : string ) : Promise<unknown>;
    abstract validateToken <T> ( token : string ) : Promise<T | null>;
}