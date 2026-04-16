import { describe, expect, jest, test } from "@jest/globals";
import { envs } from "./envs";

describe('Enviroment Variables' , () => {

    test('should return env options correctly' , () => {
        const envOptions = envs;

        expect(envOptions.PORT).toBeDefined();
        expect(envOptions.DB_CON).toBeDefined();
        expect(envOptions.DB_CON).toContain('mongodb');
        expect(envOptions.SECRET_JWT_SEED).toBeTruthy();

        expect(envOptions.CLOUDINARY_CLOUD_NAME).toBeTruthy();
        expect(envOptions.CLOUDINARY_API_KEY).toBeTruthy();
        expect(envOptions.CLOUDINARY_API_SECRET).toBeTruthy();

        expect(envOptions.MERCADOPAGO_ACCESS_TOKEN).toBeTruthy();
        expect(envOptions.MERCADOPAGO_WEBHOOK_SECRET_KEY).toBeTruthy();
        
        expect(envOptions.MAILER_SERVICE).toBeTruthy();
        expect(envOptions.MAILER_EMAIL).toBeTruthy();
        expect(envOptions.MAILER_SECRET_KEY).toBeTruthy();

        expect(envOptions.WEBSERVICE_URL).toBeTruthy();
    });

    test('should throw error if env variable is missing' , async () => {

        jest.resetModules();
        process.env.PORT = 'ABC';

        try{
            await import('./envs');
            expect(true).toBe(false);
        }
        catch( error ){
            expect(error).toBeInstanceOf(Error);
        }

    });

});