import { GetCourseById } from './../../domain/use-cases/course/get-course-by-id';
import { Request, Response } from "express";
import { CourseRepository } from "../../domain/repository/course-repository";
import { GetAllCourses } from "../../domain/use-cases/course/get-all-courses";
import { CreateCourseDto } from "../../domain/dtos/course/create-course.dto";
import { UpdateCourseDto } from "../../domain/dtos/course/update-course.dto";
import { DeleteCourse, SaveCourse, UpdateCourse } from '../../domain/use-cases';


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
            .then( courses => res.json( courses ))
            .catch( error => res.status(400).json({errorMessage: error}));
    }

    public getCourseById = ( req : Request , res : Response ) => {

        const { id }  = req.params;

        new GetCourseById( this.courseRepository )
            .execute( id )
            .then( course => res.status(200).json( course ))
            .catch( error => res.status(400).json({errorMessage : error}));
    }


    public saveCourse = ( req : Request , res : Response ) => {

        const [ errorMessage , createCourseDto ] = CreateCourseDto.create( req.body );
        if( errorMessage ) return res.status(400).json({ errorMessage });

        new SaveCourse( this.courseRepository )
            .execute( createCourseDto! )
            .then( courseCreated => res.status(201).json( courseCreated ))
            .catch( error => res.json({errorMessage : error}));
    }

    public updateCourse = async( req : Request , res : Response ) => {
        
        const { id } = req.params;
        
        const [ errorMessage , updateCourseDto ] = UpdateCourseDto.create( id , req.body );
        
        if(errorMessage) return res.status(400).json({ errorMessage });

        new UpdateCourse( this.courseRepository )
            .execute( updateCourseDto! )
            .then( courseUpdated => res.status(200).json( courseUpdated ))
            .catch( error => res.json({errorMessage : error}) );
    }


    public deleteCourse = async( req : Request , res : Response ) => {

        const { id } = req.params;

        new DeleteCourse( this.courseRepository )
            .execute( id )
            .then( hasBeenRemoved => res.status(200).json({ removed: hasBeenRemoved}))
            .catch( error => res.json({errorMessage: error }));
    }
}