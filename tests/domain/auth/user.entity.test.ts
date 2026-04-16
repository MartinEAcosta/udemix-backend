import { describe, expect, test } from '@jest/globals';
import { UserEntity } from '../../../src/domain/entities/user.entity';

describe( 'User Entity' , () => {

    test('should return a user entity instance' , () => {

        const user = UserEntity.fromObject({
            id : '123',
            username : 'testuser',
            email : 'testuser@gmail.com',
            password : 'password123',
        });

        expect( user ).toBeInstanceOf( UserEntity );
        expect( user.id ).toBe('123');
        expect( user.username ).toBe('testuser');
        expect( user.email ).toBe('testuser@gmail.com');
        expect( user.password ).toBe('password123');

    });
});