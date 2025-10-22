import mongoose, { ClientSession } from "mongoose";
import { TransactionSession, UnitOfWork } from "../domain/services/UnitOfWork";
import { MongoDatabase } from "./init";

export class MongooseUnitOfWork implements UnitOfWork {

    async startTransaction<T>( operations: ( ts : TransactionSession) => Promise<T> ) : Promise<T> {
        const session = await MongoDatabase.connection.startSession();

        let result : T;

        try{
            session.startTransaction();

            result = await operations({
                commit : async () => await session.commitTransaction(),
                abort  : async () => await session.abortTransaction(),
                getSession : () => session
            });
            await session.commitTransaction(); 
            await session.endSession();
            return result;
        }
        catch( error ){
            await session.abortTransaction();
            await session.endSession();
            throw error;
        }
        
    }

}