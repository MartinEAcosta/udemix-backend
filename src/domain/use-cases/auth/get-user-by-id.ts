import { UserResponse } from "../../dtos/auth/responses";
import { CustomError } from "../../errors/custom-error";
import { AuthRepository } from "../../repository/auth-repository";

interface GetUserByIdUseCase {
    execute( id : string ) : Promise<UserResponse>
}


export class GetUserById implements GetUserByIdUseCase{

    constructor( private readonly authRepository : AuthRepository ){ }


    async execute(id: string): Promise<UserResponse> {
        const userExists = await this.authRepository.searchUserById( id );
        if( !userExists ) throw CustomError.badRequest( `El usuario con el id: ${id} no fue encontrado.`);
        const { password , ...rest } = userExists;
        return {
            ...rest
        };
    }

}