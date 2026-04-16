import { describe, expect, test } from "@jest/globals";

import { TransactionSession } from "../../../src/domain/services/UnitOfWork";
import { AuthRepository } from '../../../src/domain/repository/auth-repository';
import { RegisterUserDto } from "../../../src/domain/dtos/auth/register-user.dto";
import { UserEntity } from "../../../src/domain/entities/user.entity";
import { UserRequestDto } from "../../../src/domain/dtos/auth/auth.responses.dto";

describe( 'Auth Repository', () => {

    class MockAuthRepository implements AuthRepository {
        async registerUser( registerUserDto : RegisterUserDto ) : Promise<UserEntity> {
            return UserEntity.fromObject(registerUserDto);
        }
        
        async findUserByEmail( email : string ) : Promise<UserEntity | null> {
            return null;
        }

        async findUserById( id : string ) : Promise<UserEntity | null> {
            return null;
        }

        async updateUser ( user : UserRequestDto , ts ?: TransactionSession ) : Promise<UserEntity> {
            return UserEntity.fromObject(user);
        }
    }

    test('should test the abstract class', async() => {

        const mockAuthRepository = new MockAuthRepository();

        expect( mockAuthRepository ).toBeInstanceOf( MockAuthRepository );
        expect( typeof mockAuthRepository.registerUser ).toBe( 'function' );
        expect( typeof mockAuthRepository.findUserByEmail ).toBe( 'function' );
        expect( typeof mockAuthRepository.findUserById ).toBe( 'function' );
        expect( typeof mockAuthRepository.updateUser ).toBe( 'function' );

        const [ error , registerUserDto ] = RegisterUserDto.create({ 
            username : 'testuser',
            email : 'testuser@gmail.com',
            password : 'testpassword'
        });

        expect( error ).toBeUndefined();
        expect( registerUserDto ).toBeInstanceOf( RegisterUserDto );

        const user = await mockAuthRepository.registerUser( registerUserDto! );
        expect( user ).toBeInstanceOf( UserEntity );
        expect( user.username ).toBe( registerUserDto!.username );
        expect( user.email ).toBe( registerUserDto!.email );
        expect( user.password ).toBe( registerUserDto!.password );
    });

});