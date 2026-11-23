import { afterAll, beforeAll, beforeEach, describe, expect, test } from '@jest/globals';
import mongoose from 'mongoose';
import { envs } from '../../../src/config/envs';
import { MongoDatabase } from '../../../src/data/init';
import { UserModel } from '../../../src/data';
import { FileModel } from '../../../src/data/mongo/models/file.model';
import { AuthDatasourceImpl } from '../../../src/infraestructure/datasources/auth-datasource-impl';
import { RegisterUserDto } from '../../../src/domain/dtos/auth/register-user.dto';
import { UpdateUserDto } from '../../../src/domain/dtos/auth/update-user-dto';
import { UpdateUserAvatarDto } from '../../../src/domain/dtos/auth/update-user-avatar.dto';
import { FileResponseDto } from '../../../src/domain/dtos/file/file-response.dto';

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

    /** Crea un File de avatar y devuelve el FileResponseDto que produciría el upload. */
    const createAvatarFile = async( suffix : string ) : Promise<FileResponseDto> => {
        const avatarFile = await FileModel.create({
            public_id : `test/avatar-${ suffix }`,
            url : `https://example.test/avatar-${ suffix }.jpg`,
            folder : 'user',
            size : 1024,
            extension : 'jpg',
            resource_type : 'image',
        });

        return {
            id : avatarFile._id.toString(),
            public_id : avatarFile.public_id,
            url : avatarFile.url!,
            folder : 'user',
            size : avatarFile.size,
            extension : avatarFile.extension!,
            resource_type : 'image',
        };
    }

    test('should return avatar_url null for a freshly registered user' , async() => {
        const createdUser = await authDatasource.registerUser(registerUserDto!);

        expect( createdUser.avatar_url ).toBeNull();
        expect( createdUser.id_file ).toBeNull();
    });

    test('should persist id_file and avatar_url together via updateUserAvatar' , async() => {
        const createdUser = await authDatasource.registerUser(registerUserDto!);
        const avatarFile = await createAvatarFile('1');

        const updatedUser = await authDatasource.updateUserAvatar(
            UpdateUserAvatarDto.fromUploadedFile( createdUser.id! , avatarFile )
        );

        expect( updatedUser.id_file ).toBe( avatarFile.id );
        expect( updatedUser.avatar_url ).toBe( avatarFile.url );

        // Persistido en el documento, no derivado en la lectura.
        const rawUser = await UserModel.findById( createdUser.id ).lean();
        expect( rawUser!.avatar_url ).toBe( avatarFile.url );
    });

    test('should clear id_file and avatar_url together via updateUserAvatar' , async() => {
        const createdUser = await authDatasource.registerUser(registerUserDto!);
        const avatarFile = await createAvatarFile('2');

        await authDatasource.updateUserAvatar(
            UpdateUserAvatarDto.fromUploadedFile( createdUser.id! , avatarFile )
        );

        const clearedUser = await authDatasource.updateUserAvatar(
            UpdateUserAvatarDto.cleared( createdUser.id! )
        );

        expect( clearedUser.id_file ).toBeNull();
        expect( clearedUser.avatar_url ).toBeNull();
    });

    test('should throw when updateUserAvatar targets a user that does not exist' , async() => {
        const missingId = new mongoose.Types.ObjectId().toString();

        await expect(
            authDatasource.updateUserAvatar( UpdateUserAvatarDto.cleared( missingId ) )
        ).rejects.toThrow();
    });

    test('should return the persisted avatar_url via findUserByEmail and findUserById' , async() => {
        const createdUser = await authDatasource.registerUser(registerUserDto!);
        const avatarFile = await createAvatarFile('3');

        await authDatasource.updateUserAvatar(
            UpdateUserAvatarDto.fromUploadedFile( createdUser.id! , avatarFile )
        );

        const byEmail = await authDatasource.findUserByEmail( createdUser.email );
        expect( byEmail!.avatar_url ).toBe( avatarFile.url );
        expect( byEmail!.id_file ).toBe( avatarFile.id );

        const byId = await authDatasource.findUserById( createdUser.id! );
        expect( byId!.avatar_url ).toBe( avatarFile.url );
        expect( byId!.id_file ).toBe( avatarFile.id );
    });

    test('should return a null avatar_url when the user has no avatar' , async() => {
        const createdUser = await authDatasource.registerUser(registerUserDto!);

        const user = await authDatasource.findUserByEmail( createdUser.email );

        expect( user ).not.toBeNull();
        expect( user!.avatar_url ).toBeNull();
        expect( user!.id_file ).toBeNull();
    });

    // Regresión: updateUser recibía el DTO completo como objeto de update, así que cualquier
    // actualización de perfil borraba el id_file (el DTO lo defaulteaba a null) y un body podía
    // apuntar el FK al File de otra persona.
    test('should leave id_file and avatar_url untouched on a profile update' , async() => {
        const createdUser = await authDatasource.registerUser(registerUserDto!);
        const avatarFile = await createAvatarFile('4');

        await authDatasource.updateUserAvatar(
            UpdateUserAvatarDto.fromUploadedFile( createdUser.id! , avatarFile )
        );

        const [ dtoError , updateUserDto ] = UpdateUserDto.create({
            id : createdUser.id!,
            first_name : 'Renamed',
        });
        expect( dtoError ).toBeUndefined();

        const updatedUser = await authDatasource.updateUser( updateUserDto! );

        expect( updatedUser.first_name ).toBe('Renamed');
        expect( updatedUser.id_file ).toBe( avatarFile.id );
        expect( updatedUser.avatar_url ).toBe( avatarFile.url );
    });

    test('should ignore id_file and avatar_url sent through the generic update path' , async() => {
        const createdUser = await authDatasource.registerUser(registerUserDto!);
        const avatarFile = await createAvatarFile('5');

        await authDatasource.updateUserAvatar(
            UpdateUserAvatarDto.fromUploadedFile( createdUser.id! , avatarFile )
        );

        const foreignFile = await createAvatarFile('ajeno');

        const updatedUser = await authDatasource.updateUser({
            id : createdUser.id!,
            first_name : 'Renamed',
            id_file : foreignFile.id,
            avatar_url : 'https://evil.test/spoofed.png',
        } as unknown as UpdateUserDto );

        expect( updatedUser.id_file ).toBe( avatarFile.id );
        expect( updatedUser.avatar_url ).toBe( avatarFile.url );
    });

    // El balance llegaba a Mongo spreadeando la UserEntity completa dentro de updateUser.
    // Con el $set explícito tiene que seguir funcionando, ahora por el factory declarado.
    test('should persist the balance through UpdateUserDto.balanceUpdate' , async() => {
        const createdUser = await authDatasource.registerUser(registerUserDto!);

        const updatedUser = await authDatasource.updateUser(
            UpdateUserDto.balanceUpdate( createdUser.id! , 1500 )
        );

        expect( updatedUser.balance ).toBe( 1500 );
    });

});