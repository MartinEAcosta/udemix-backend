import { describe, expect, test } from "@jest/globals";
import { RegisterUserDto } from "../../../src/domain/dtos/auth/register-user.dto";
import { UserResponseDto } from '../../../src/domain/dtos/auth/auth.responses.dto';
import { AuthDatasource } from '../../../src/domain/datasources/auth-datasource';

// TODO : FALTA EL TESTING CON EL DTO
describe( 'Auth Datasource' , () => {

    class MockAuthDatasource implements AuthDatasource {

        async registerUser( registerUserDto : RegisterUserDto ) : Promise<UserResponseDto>{
            return {
                id: 'mockedUserId',
                username: registerUserDto.username,
                email: registerUserDto.email,
                isEmailVerified : false,
                role : 'student',
                balance : 0,   
            }
        }

        async updateUser ( user : UserResponseDto ) : Promise<UserResponseDto> {
            return user;
        }

        async findUserByEmail( email : string ): Promise<UserResponseDto | null> {
            return Promise.resolve(null);
        }

        async findUserById( id : string ): Promise<UserResponseDto | null> {
            return Promise.resolve(null);
        }

    }

    const mockAuthDatasource = new MockAuthDatasource();
    const registerUserDTO = {
        username : 'testuser',
        email : 'testuser@gmail.com',
        password : 'testpassword'
    }

    test('should test the abstract class' , async() => {

        expect( mockAuthDatasource ).toBeInstanceOf( MockAuthDatasource );
        expect( typeof mockAuthDatasource.registerUser ).toBe( 'function' );
        expect( typeof mockAuthDatasource.updateUser ).toBe( 'function' );
        expect( typeof mockAuthDatasource.findUserByEmail ).toBe( 'function' );
        expect( typeof mockAuthDatasource.findUserById ).toBe( 'function' );

        const user = await mockAuthDatasource.findUserByEmail( registerUserDTO.email );
        expect( user ).toBeNull();
        const registeredUser = await mockAuthDatasource.registerUser(registerUserDTO);
        expect( registeredUser ).toEqual({
            id : expect.any(String),
            username : registerUserDTO.username,
            email : registerUserDTO.email,
            isEmailVerified : false,
            role : 'student',
            balance : 0,
        });
    });

})