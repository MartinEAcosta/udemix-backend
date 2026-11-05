import { describe, expect, test } from '@jest/globals';
import { UserEntity } from '../../../src/domain/entities/user.entity';

describe( 'User Entity' , () => {

    test('should return a user entity instance' , () => {

        const user = UserEntity.fromObject({
            id : '123',
            first_name : 'Test',
            last_name : 'User',
            email : 'testuser@gmail.com',
            password : 'password123',
        });

        expect( user ).toBeInstanceOf( UserEntity );
        expect( user.id ).toBe('123');
        expect( user.first_name ).toBe('Test');
        expect( user.last_name ).toBe('User');
        expect( user.email ).toBe('testuser@gmail.com');
        expect( user.password ).toBe('password123');

    });

    test('should throw if first_name is missing' , () => {
        expect( () => UserEntity.fromObject({
            id : '123',
            last_name : 'User',
            email : 'testuser@gmail.com',
            password : 'password123',
        }) ).toThrow('El nombre es requerido.');
    });

    test('should throw if last_name is missing' , () => {
        expect( () => UserEntity.fromObject({
            id : '123',
            first_name : 'Test',
            email : 'testuser@gmail.com',
            password : 'password123',
        }) ).toThrow('El apellido es requerido.');
    });
});