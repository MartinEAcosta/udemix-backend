import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import mongoose from 'mongoose';
import { envs } from '../../../src/config/envs';
import { MongoDatabase } from '../../../src/data/init';
import { UserModel } from '../../../src/data';
import { AuthDatasourceImpl } from '../../../src/infraestructure/datasources/auth-datasource-impl';
import { RegisterUserDto } from '../../../src/domain/dtos/auth/register-user.dto';

describe('Auth Datasource Implementation' , () => {

    beforeAll(async() => {
        await MongoDatabase.connect({
            dbUrl : envs.DB_CON,
            dbName :envs.DB_NAME
        });
    }) ;

    beforeEach( async() => {
        await UserModel.deleteMany({});
    });

    afterAll(async() => {
        mongoose.connection.close();
    });
    
    const authDatasource = new AuthDatasourceImpl();

    const [ error , registerUserDto ] = RegisterUserDto.create({
        username : 'testuser',
        password : 'testpassword',
        email : 'testuser@example.com'
    });  


    test('should create a new user' , async() => {

        expect( error ).toBe(undefined);

        await authDatasource.registerUser(registerUserDto!);
        const foundUser = await UserModel.findOne({ email : registerUserDto!.email });

        expect( foundUser ).not.toBeNull();
        expect( foundUser!.email ).toBe( registerUserDto!.email );
    });

    test('should find a user by email' , async() => {
        const createdUser = await authDatasource.registerUser(registerUserDto!);
        const user = await authDatasource.findUserByEmail( createdUser!.email );

        expect( user ).not.toBeNull();
        expect( user!.email ).toBe( createdUser.email );
    });

    test('should find a user by id' , async() => {
        const createdUser = await authDatasource.registerUser(registerUserDto!);
        const foundUser = await authDatasource.findUserById( createdUser.id! );

        expect( foundUser ).not.toBeNull();
        expect( foundUser!.id ).toBe( createdUser.id );
    });

});