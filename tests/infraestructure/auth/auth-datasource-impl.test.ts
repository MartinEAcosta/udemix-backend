import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import mongoose from 'mongoose';
import { envs } from '../../../src/config/envs';
import { MongoDatabase } from '../../../src/data/init';
import { UserModel } from '../../../src/data';
import { FileModel } from '../../../src/data/mongo/models/file.model';
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
        await FileModel.deleteMany({});
    });

    afterAll(async() => {
        mongoose.connection.close();
    });
    
    const authDatasource = new AuthDatasourceImpl();

    const [ error , registerUserDto ] = RegisterUserDto.create({
        first_name : 'Test',
        last_name : 'User',
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

    test('should derive avatar_url from the populated file on login lookup' , async() => {
        const createdUser = await authDatasource.registerUser(registerUserDto!);

        const avatarFile = await FileModel.create({
            public_id : 'test/avatar-1',
            url : 'https://example.test/avatar-1.jpg',
            folder : 'user',
            size : 1024,
            extension : 'jpg',
            resource_type : 'image',
        });

        await UserModel.findByIdAndUpdate( createdUser.id , { id_file : avatarFile._id } );

        const loginUser = await authDatasource.findUserByEmailForLogin( createdUser.email );

        expect( loginUser ).not.toBeNull();
        expect( loginUser!.avatar_url ).toBe( avatarFile.url );
        expect( loginUser!.id_file ).toBe( avatarFile._id.toString() );
    });

    test('should return a null avatar_url when the user has no linked file' , async() => {
        const createdUser = await authDatasource.registerUser(registerUserDto!);

        const loginUser = await authDatasource.findUserByEmailForLogin( createdUser.email );

        expect( loginUser ).not.toBeNull();
        expect( loginUser!.avatar_url ).toBeNull();
        expect( loginUser!.id_file ).toBeNull();
    });

});