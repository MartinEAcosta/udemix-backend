import { AuthRepository } from "../../repository/auth-repository";
import { CustomError } from "../../errors/custom-error";
import { UserResponseDto } from "../../dtos/auth/auth.responses.dto";

interface FindUserByIdUseCase {
    execute( id : string ) : Promise<UserResponseDto>
}

export class FindUserById implements FindUserByIdUseCase{

    constructor( private readonly authRepository : AuthRepository ){ }

    async execute(id: string): Promise<UserResponseDto>{
        const userExists = await this.authRepository.findUserById( id );
        if( !userExists ) throw CustomError.badRequest( `El usuario con el id: ${id} no fue encontrado.`);
        const { password , ...rest } = userExists;
        return {
            ...rest
        };
    }

}