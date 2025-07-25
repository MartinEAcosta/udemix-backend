

export abstract class TokenManager { 

    abstract generateToken( _id : string , email : string ) : Promise<unknown>;
    
}