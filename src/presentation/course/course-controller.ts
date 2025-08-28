import { Request, Response } from "express";

import { CourseRepository } from "../../domain/repository/course-repository";
import { DeleteCourse, SaveCourse, UpdateCourse , GetAllCourses , GetCourseById} from '../../domain/use-cases';
import { CreateCourseDto , UpdateCourseDto } from "../../domain/dtos";
import { HandlerResponses } from '../helpers/handler-responses';
import { AuthenticathedRequest } from "../middlewares/auth.middleware";


export class CourseController {

    // Inyección de dependencias
    constructor (
        private readonly courseRepository : CourseRepository,
    ){ }

    // * EXPRESS RECOMIENDA NO UTILIZAR TAREAS ASINCRONAS EN EL CONTROLADOR

    // * Ejemplo
    
    //   public getTodos = ( req: Request, res: Response ) => {

    //     new GetTodos( this.todoRepository )
    //       .execute()
    //       .then( todos => res.json( todos ) )
    //       .catch( error => res.status( 400 ).json( { error } ) );

    //   };

    public getAllCourses = ( req : Request , res : Response ) => {

        new GetAllCourses( this.courseRepository )
            .execute()
            .then( courses => HandlerResponses.handleSuccess( res , courses ) )
            .catch( error => HandlerResponses.handleError( error , res ));
    }

    public getCourseById = ( req : Request , res : Response ) => {

        const { id }  = req.params;

        new GetCourseById( this.courseRepository )
            .execute( id )
            .then( course => HandlerResponses.handleSuccess( res, course ) )
            .catch( error => HandlerResponses.handleError( error , res ));
    }


    public saveCourse = ( req : AuthenticathedRequest , res : Response ) => {
        const [ errorMessage , createCourseDto ] = CreateCourseDto.create( req.body );
        if( errorMessage ) return res.status(400).json({ errorMessage });
        
        new SaveCourse( this.courseRepository )
            .execute( createCourseDto! )
            .then( courseCreated => HandlerResponses.handleSuccess( res, courseCreated , 201 ) )
            .catch( error => HandlerResponses.handleError( error , res ));
    }

    public updateCourse = async( req : Request , res : Response ) => {
        const { id } = req.params;

        const [ errorMessage , updateCourseDto ] = UpdateCourseDto.create( id , req.body );
        if( errorMessage ) return res.status(400).json({ errorMessage });

        new UpdateCourse( this.courseRepository )
            .execute( updateCourseDto! )
            .then( courseUpdated => HandlerResponses.handleSuccess( res , courseUpdated ) )
            .catch( error => HandlerResponses.handleError( error , res ) );
    }


    public deleteCourse = async( req : Request , res : Response ) => {

        const { id } = req.params;

        new DeleteCourse( this.courseRepository )
            .execute( id )
            .then( hasBeenRemoved => HandlerResponses.handleSuccess( res , { removed: hasBeenRemoved } , 200) )
            .catch( error => HandlerResponses.handleError(error , res) );
    }
}