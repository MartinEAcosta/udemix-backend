import { describe, expect, test } from "@jest/globals";
import { RegisterUserDto } from "../../../src/domain/dtos/auth/register-user.dto";
import { UserLoginResponseDto, UserResponseDto } from '../../../src/domain/dtos/auth/auth.responses.dto';
import { UpdateUserDto } from '../../../src/domain/dtos/auth/update-user-dto';
import { AuthDatasource } from '../../../src/domain/datasources/auth-datasource';

// TODO : FALTA EL TESTING CON EL DTO
describe( 'Auth Datasource' , () => {

    class MockAuthDatasource implements AuthDatasource {

        async registerUser( registerUserDto : RegisterUserDto ) : Promise<UserResponseDto>{
            return {
                id: 'mockedUserId',
                first_name: registerUserDto.first_name,
                last_name: registerUserDto.last_name,
                email: registerUserDto.email,
                isEmailVerified : false,
                role : 'student',
                balance : 0,
            }
        }

        async updateUser ( userDto : UpdateUserDto ) : Promise<UserResponseDto> {
            return {
                id: userDto.id,
                first_name: userDto.first_name ?? 'mockedFirstName',
                last_name: userDto.last_name ?? 'mockedLastName',
                email: userDto.email ?? 'mocked@email.com',
                isEmailVerified : false,
                role : 'student',
                balance : 0,
            }
        }

        async findUserByEmail( email : string ): Promise<UserResponseDto | null> {
            return Promise.resolve(null);
        }

        async findUserById( id : string ): Promise<UserResponseDto | null> {
            return Promise.resolve(null);
        }

        async findUserByEmailForLogin( email : string ): Promise<UserLoginResponseDto | null> {
            return Promise.resolve(null);
        }

    }

    const mockAuthDatasource = new MockAuthDatasource();
    const registerUserDTO = {
        first_name : 'Test',
        last_name : 'User',
        email : 'testuser@gmail.com',
        password : 'testpassword'
    }

    test('should test the abstract class' , async() => {

        expect( mockAuthDatasource ).toBeInstanceOf( MockAuthDatasource );
        expect( typeof mockAuthDatasource.registerUser ).toBe( 'function' );
        expect( typeof mockAuthDatasource.updateUser ).toBe( 'function' );
        expect( typeof mockAuthDatasource.findUserByEmail ).toBe( 'function' );
        expect( typeof mockAuthDatasource.findUserById ).toBe( 'function' );
        expect( typeof mockAuthDatasource.findUserByEmailForLogin ).toBe( 'function' );

        const user = await mockAuthDatasource.findUserByEmail( registerUserDTO.email );
        expect( user ).toBeNull();
        const registeredUser = await mockAuthDatasource.registerUser(registerUserDTO);
        expect( registeredUser ).toEqual({
            id : expect.any(String),
            first_name : registerUserDTO.first_name,
            last_name : registerUserDTO.last_name,
            email : registerUserDTO.email,
            isEmailVerified : false,
            role : 'student',
            balance : 0,
        });
    });

})