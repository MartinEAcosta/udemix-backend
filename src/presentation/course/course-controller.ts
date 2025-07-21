import { GetCourseById } from './../../domain/use-cases/course/get-course-by-id';
import { Request, Response } from "express";
import { CourseRepository } from "../../domain/repository/course.repository";
import { GetAllCourses } from "../../domain/use-cases/course/get-all-courses";
import { CreateCourseDto } from "../../domain/dtos/course/create-course.dto";
import { ok } from "assert";
import { UpdateCourseDto } from "../../domain/dtos/course/update-course.dto";


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
            .catch( error => res.status(400).json({ error }));

        // const courses = await this.courseRepository.getAllCourses();
        
        // return res.json(courses);
    }

    public getCourseById = ( req : Request , res : Response ) => {

        const { id }  = req.params;

        new GetCourseById( this.courseRepository )
            .execute( id )
            .then( course => res.status(200).json( course ))
            .catch( error => res.status(400).json({error}));

        // try{
        //     const course = await this.courseRepository.getCourseById( id );

        //     return res.status(200).json({
        //         ok : true,
        //         course,
        //     });
        // }
        // catch(error){
        //     return res.status(400).json({
        //         ok : false,
        //         errorMessage : error,
        //     });
        // }
    }


    public saveCourse =  async( req : Request , res : Response ) => {

        const [ errorMessage , createCourseDto ] = CreateCourseDto.create( req.body );
        if( errorMessage ) return res.status(400).json({
                                                        ok : false,
                                                        errorMessage,
        });

        console.log(createCourseDto)

        try{

            const course = await this.courseRepository.saveCourse( createCourseDto! );

            return res.status(201).json({
                ok : true,
                course,
            });
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                ok : false,
                errorMessage : 'Hubo un error en la creación del curso.',
            });
        }
    }

    public updateCourse = async( req : Request , res : Response ) => {
        
        const { id } = req.params;
        
        const [ errorMessage , updateCourseDto ] = UpdateCourseDto.create( id , req.body );
        
        if(errorMessage) return res.status(400).json({
                                                        ok : false,
                                                        errorMessage,   
        });

        try{

            const updatedCourse = await this.courseRepository.updateCourse( { id: id , ...updateCourseDto });
            return res.status(200).json({
                ok : true,
                updatedCourse,
            });
            
        }
        catch(error){
            console.log(error);
            return res.status(500).json({
                ok : false,
                errorMessage : 'Hubo un error al actualizar el Curso.',
            });
        }
    }

}