import { Request, Response } from "express";

import { CourseRepository } from "../../domain/repository/course-repository";
import { DeleteCourse, FindAllCourses, FindCourseById, SaveCourse, UpdateCourse } from '../../domain/use-cases';
import { CreateCourseDto , UpdateCourseDto } from "../../domain/dtos";
import { HandlerResponses } from '../helpers/handler-responses';
import { AuthenticatedRequest } from "../middlewares/auth.middleware";


export class CourseController {

    // Inyección de dependencias
    constructor (
        private readonly courseRepository : CourseRepository,
    ){ }

    public findAllCourses = ( req : Request , res : Response ) => {

        new FindAllCourses( this.courseRepository )
            .execute()
            .then( courses => HandlerResponses.handleSuccess( res , courses, 200 ) )
            .catch( error => HandlerResponses.handleError( error , res ));
    }

    public findCourseById = ( req : Request , res : Response ) => {

        const { id }  = req.params;

        new FindCourseById( this.courseRepository )
            .execute( id )
            .then( course => HandlerResponses.handleSuccess( res, course, 200 ) )
            .catch( error => HandlerResponses.handleError( error , res ));
    }


    public saveCourse = ( req : AuthenticatedRequest , res : Response ) => {
        const [ errorMessage , createCourseDto ] = CreateCourseDto.create( req.body );
        if( errorMessage ) return res.status(400).json({ errorMessage });
        
        new SaveCourse( this.courseRepository )
            .execute( createCourseDto! )
            .then( courseCreated => HandlerResponses.handleSuccess( res, courseCreated , 201 ) )
            .catch( error => HandlerResponses.handleError( error , res ));
    }

    public updateCourse = ( req : Request , res : Response ) => {
        const { id } = req.params;

        const [ errorMessage , updateCourseDto ] = UpdateCourseDto.create( id , req.body );
        if( errorMessage ) return res.status(400).json({ errorMessage });

        new UpdateCourse( this.courseRepository )
            .execute( updateCourseDto! )
            .then( courseUpdated => HandlerResponses.handleSuccess( res , courseUpdated, 200 ) )
            .catch( error => HandlerResponses.handleError( error , res ) );
    }


    public deleteCourse = ( req : Request , res : Response ) => {

        const { id } = req.params;

        new DeleteCourse( this.courseRepository )
            .execute( id )
            .then( hasBeenRemoved => HandlerResponses.handleSuccess( res , { removed: hasBeenRemoved } , 200) )
            .catch( error => HandlerResponses.handleError(error , res) );
    }
}