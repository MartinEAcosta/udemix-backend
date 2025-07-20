import mongoose from "mongoose";

interface ConnectionOptions {
    dbUrl : string,
    dbName?: string,
}

export class MongoDatabase {
    
    static async connect( options : ConnectionOptions ){
        const { dbUrl , dbName } = options;

        try{

            await mongoose.connect( dbUrl );

             console.log('Hemos sido conectados con éxito ;) !');

        }
        catch( error ){
            console.log('Ha surgido un error al intentar conectarnos con la DB.');
            console.log(error);
        }
    }
}