import mongoose, { Connection } from "mongoose";

interface ConnectionOptions {
    dbUrl : string,
    dbName?: string,
}

export class MongoDatabase {

    static connection : Connection;

    static async connect( options : ConnectionOptions ) : Promise<boolean> { 
        const { dbUrl , dbName } = options;

        try{
            this.connection = (await mongoose.connect( dbUrl , { dbName } )).connection;
            console.log('Hemos sido conectados con éxito ;) !');
            return true;
        }
        catch( error ){
            console.log('Ha surgido un error al intentar conectarnos con la DB.');
            console.log(error);
            throw error;
        }
    }
}