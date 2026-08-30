import { beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { RegisterUser } from '../../../src/domain/use-cases/auth/register-user';
import { AuthRepository } from '../../../src/domain/repository/auth-repository';
import { Encrypter } from '../../../src/domain/services/Encrypter';
import { TokenManager } from '../../../src/domain/services/TokenManager';

describe('RegisterUser UseCase' , () => {

    let mockAuthRepository : Partial<jest.Mocked<AuthRepository>>;
    let mockEncrypter : Partial<jest.Mocked<Encrypter>>;
    let mockTokenManager : Partial<jest.Mocked<TokenManager>>;
    let registerUserUseCase : RegisterUser;

    beforeAll( () => {
        mockAuthRepository = {
            findUserByEmail : jest.fn(),
            registerUser : jest.fn()
        };
        mockEncrypter = {
            hash : jest.fn(),
        };
        mockTokenManager = {
            generateToken : jest.fn(),
        };

        registerUserUseCase = new RegisterUser( 
            mockAuthRepository as AuthRepository,
            mockEncrypter as Encrypter,
            mockTokenManager as TokenManager
        );
    });

    beforeEach( () => {
        jest.clearAllMocks();
    });

    test('should register a new user successfully', async ( ) => {
    
        const registerUserDtoTest = {
            username : 'testuser',
            email : 'testuser@example.com',
            password : '123456asd'
        };

        mockAuthRepository.findUserByEmail?.mockResolvedValue( null );    
        mockAuthRepository.registerUser?.mockResolvedValue({
            id: 'mockedUserId',
            username: registerUserDtoTest.username,
            password : 'hashedPassword',
            email: registerUserDtoTest.email,
            isEmailVerified : false,
            role : 'student',
            balance : 0,
        });

        mockTokenManager.generateToken?.mockResolvedValue( 'mockedToken' );
        const result = await registerUserUseCase.execute( registerUserDtoTest );
        
        expect( mockAuthRepository.findUserByEmail ).toHaveBeenCalledWith( registerUserDtoTest.email );
        expect( mockEncrypter.hash ).toHaveBeenCalledWith( registerUserDtoTest.password );
        expect(result).toHaveProperty('user');
        expect(result).toHaveProperty('token');
        expect(result.user).toEqual({
            id: 'mockedUserId',
            username: registerUserDtoTest.username,
            email: registerUserDtoTest.email,
            isEmailVerified: false,
        });
    });

    test('should throw an error if email is already registered', async () => {
        const registerUserDto = {
            username : 'testuser',
            email : 'testuser@example.com',
            password : '123456asd',
        };

        try {
            mockAuthRepository.findUserByEmail?.mockResolvedValue({
                id: 'existingUserId',
                username: 'existingUser',
                email: registerUserDto.email,
                password : 'hashedPassword',
                isEmailVerified : false,
                role : 'student',
                balance : 0,
            });
            await registerUserUseCase.execute( registerUserDto );
            expect(true).toBe(false);
        }
        catch( error ){
            expect( error ).toBeInstanceOf( Error );
        }
    });

});