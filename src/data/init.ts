import mongoose, { Connection } from "mongoose";

interface ConnectionOptions {
    dbUrl : string,
    dbName?: string,
}

export class MongoDatabase {

    static connection : Connection;

    static async connect( options : ConnectionOptions ){
        const { dbUrl , dbName } = options;

        try{

            this.connection  = (await mongoose.connect( dbUrl )).connection;
            

            console.log('Hemos sido conectados con éxito ;) !');
            return this.connection;
        }
        catch( error ){
            console.log('Ha surgido un error al intentar conectarnos con la DB.');
            console.log(error);
        }
    }
}