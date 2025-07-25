

export abstract class TokenManager { 

    abstract generateToken( payload : any , duration? : string ) : Promise<unknown>;
}