import { Response } from "express";
import { CustomError } from "../../domain/errors/custom-error";
import { ModuleRepository } from "../../domain/repository/module-repository";
import { HandlerResponses } from "../helpers/handler-responses";
import { AuthenticatedRequest } from "../middlewares";
import { CreateModuleDto } from "../../domain/dtos/module/create-module.dto";
import { CreateModule } from "../../domain/use-cases/module/create-module";
import { CourseRepository } from "../../domain/repository/course-repository";


export class ModuleController {

    constructor (
        private readonly moduleRepository : ModuleRepository,
        private readonly courseRepository : CourseRepository,
    ){ }


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


}