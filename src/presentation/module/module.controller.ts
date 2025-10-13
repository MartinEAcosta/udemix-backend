import { Response } from "express";
import { CustomError } from "../../domain/errors/custom-error";
import { ModuleRepository } from "../../domain/repository/module-repository";
import { HandlerResponses } from "../helpers/handler-responses";
import { AuthenticatedRequest } from "../middlewares";
import { CreateModuleDto } from "../../domain/dtos/module/create-module.dto";
import { CreateModule } from "../../domain/use-cases/module/create-module";
import { CourseRepository } from "../../domain/repository/course-repository";
import { DeleteModule } from "../../domain/use-cases/module/delete-module";
import { FindModuleById } from "../../domain/use-cases/module/find-module-by-id";
import { FindAllModules } from "../../domain/use-cases/module/find-all-modules";


export class ModuleController {

    constructor (
        private readonly moduleRepository : ModuleRepository,
        private readonly courseRepository : CourseRepository,
    ){ }


    //* VERIFICAR LA FORMA EN LA QUE SE TOMA EL ROL

    public createModule = ( req : AuthenticatedRequest , res : Response ) => {

        const { user } = req;
        if( !user ) return HandlerResponses.handleError( CustomError.unauthorized('Debes estar autenticado para crear un modulo.') , res );
        if( user.role === 'student' ) return HandlerResponses.handleError( CustomError.unauthorized('No tienes los permisos suficientes para crear un modulo.') , res );

        const [ error , createModuleDto ] = CreateModuleDto.create( req.body );
        if( error ) return HandlerResponses.handleError( CustomError.badRequest(error) , res );

        new CreateModule( this.moduleRepository , this.courseRepository )
                .execute( createModuleDto!, user )
                .then( moduleResponse => HandlerResponses.handleSuccess( res , moduleResponse , 201 ) )
                .catch( error => HandlerResponses.handleError(error,res) ); 
    }

    public deleteModule = ( req : AuthenticatedRequest , res : Response ) => {

        const { user } = req;
        if( !user ) return HandlerResponses.handleError( CustomError.unauthorized('Debes estar autenticado para eliminar un modulo.') , res );
        if( user.role === 'student' ) return HandlerResponses.handleError( CustomError.unauthorized('No tienes los permisos suficientes para crear un modulo.') , res );

        const { id } = req.params;
        if( !id ) return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id para remover un modulo.') , res );

        new DeleteModule( this.moduleRepository , this.courseRepository )
                .execute( id , user.id )
                .then( moduleResponse => HandlerResponses.handleSuccess( res , moduleResponse , 200 ) )
                .catch( error => HandlerResponses.handleError(error,res) ); 
    }

    public findAllModules = ( req : AuthenticatedRequest , res : Response ) => {
        const { user } = req;
        if( !user ) return HandlerResponses.handleError( CustomError.unauthorized('Debes estar autenticado para eliminar un modulo.') , res );

        new FindAllModules( this.moduleRepository )
                .execute()
                .then( moduleResponse => HandlerResponses.handleSuccess( res , moduleResponse , 200 ) )
                .catch( error => HandlerResponses.handleError(error,res) ); 
    }

    public findModuleById = ( req : AuthenticatedRequest , res : Response ) => {

        const { user } = req;
        if( !user ) return HandlerResponses.handleError( CustomError.unauthorized('Debes estar autenticado para buscar un modulo.') , res );
        
        const { id } = req.params;
        if( !id ) return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id para obtener el modulo.') , res );
        
        new FindModuleById( this.moduleRepository )
            .execute( id )
            .then( moduleResponse => HandlerResponses.handleSuccess( res , moduleResponse , 200 ) )
            .catch( error => HandlerResponses.handleError(error,res) ); 
    }

}