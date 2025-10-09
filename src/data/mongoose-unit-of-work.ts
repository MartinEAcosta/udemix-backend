import mongoose, { ClientSession } from "mongoose";

export class MongooseUnitOfWork{

    async withTransaction( operation : (session : ClientSession) => Promise<any> ) {
        const session = await mongoose.startSession();
        try{

            session.startTransaction();

            const result = await operation( session );
            await session.commitTransaction();

            return result;
        }
        catch( error ){
            await session.abortTransaction();
            throw error;
        }
        finally{
            session.endSession();
        }
    } 

}