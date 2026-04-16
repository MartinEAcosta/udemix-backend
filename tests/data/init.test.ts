import { afterAll, describe, expect, test } from "@jest/globals";
import { MongoDatabase } from '../../src/data/init';

describe('Init Data Layer' , () => {

    afterAll( () => {
        MongoDatabase.connection.close();
    });

    test('should initialize the database connection' , async() => {
        const connection = await MongoDatabase.connect({ 
            dbUrl: process.env.DB_CON!,
            dbName: process.env.DB_NAME!,
        });
        expect(connection).toBe(true);
    });

    test('should handle database connection errors' , async() => {
        try{
            await MongoDatabase.connect({
                dbUrl: 'invalid_db_url',
                dbName: 'invalid_db_name',
            });
            expect(true).toBe(false);
        }
        catch( error ){ 
            expect(error).toBeInstanceOf(Error);
        }

    });

})