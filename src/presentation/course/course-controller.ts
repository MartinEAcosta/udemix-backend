import { Request, Response } from "express";

import { CourseRepository } from "../../domain/repository/course-repository";
import { DeleteCourse, FindAllCourses, FindCourseById, SaveCourse, UpdateCourse } from '../../domain/use-cases';
import { CreateCourseDto , UpdateCourseDto } from "../../domain/dtos";
import { HandlerResponses } from '../helpers/handler-responses';
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { FindCoursesByCategory } from "../../domain/use-cases/course/find-courses-by-category";
import { CategoryRepository } from "../../domain/repository/category-repository";
import { FileRepository } from "../../domain/repository/file-repository";
import { CustomError } from "../../domain/errors/custom-error";
import { FindCoursesPaginated } from "../../domain/use-cases/course/find-courses-paginated";
import { CourseFilterRequest } from "../middlewares";
import { FindCoursesByIds } from "../../domain/use-cases/course/find-courses-by-ids";


export class CourseController {

    constructor (
        private readonly courseRepository : CourseRepository,
        private readonly categoryRepository : CategoryRepository,
        private readonly fileRepository : FileRepository,
    ){ }

    public findAllCourses = ( req : CourseFilterRequest , res : Response ) => {

        new FindAllCourses( this.courseRepository )
            .execute( req?.courseQuery )
            .then( courses => HandlerResponses.handleSuccess( res , courses, 200 ) )
            .catch( error => HandlerResponses.handleError( error , res ));
    }

    public findCoursesByIds = ( req : Request , res : Response ) => {

        const { id_courses } = req.body;
        if( !id_courses ) return HandlerResponses.handleError( CustomError.badRequest('Debes indicar el id de los cursos a buscar.'), res);

        new FindCoursesByIds( this.courseRepository )
            .execute( id_courses )
            .then( courses => HandlerResponses.handleSuccess( res , courses , 200) )
            .catch( error => HandlerResponses.handleError( error , res ));
    }

    public findCoursesPaginated = ( req : Request , res : Response ) => {

        const { pagination } = req.body;
        
        new FindCoursesPaginated( this.courseRepository )
                .execute( pagination )
                .then( courses => HandlerResponses.handleSuccess( res , courses , 200) )
                .catch( error => HandlerResponses.handleError( error , res ));
    }

    public findCourseById = ( req : Request , res : Response ) => {

        const { id }  = req.params;

        new FindCourseById( this.courseRepository )
            .execute( id )
            .then( course => HandlerResponses.handleSuccess( res, course, 200 ) )
            .catch( error => HandlerResponses.handleError( error , res ));
    }

    public findCoursesByCategory = ( req : Request , res : Response ) => {
        const { slug } = req.params;
        
        new FindCoursesByCategory( this.courseRepository , this.categoryRepository )
            .execute( slug )
            .then( course => HandlerResponses.handleSuccess( res, course, 200 ) )
            .catch( error => HandlerResponses.handleError( error , res ));

    }

    public saveCourse = ( req : AuthenticatedRequest , res : Response ) => {

        const fileUploadDto = req.body.attachedFile;

        const [ errorMessage , createCourseDto ] = CreateCourseDto.create( req.body );
        if( errorMessage ) return HandlerResponses.handleError( CustomError.badRequest( errorMessage ) , res );
        
        new SaveCourse( this.courseRepository , this.fileRepository , this.categoryRepository )
            .execute( createCourseDto! , fileUploadDto )
            .then( courseCreated => HandlerResponses.handleSuccess( res, courseCreated , 201 ) )
            .catch( error => HandlerResponses.handleError( error , res ));
    }

    public updateCourse = ( req : Request , res : Response ) => {

        const fileUploadDto = req.body.attachedFile;
        const { id } = req.params;

        const [ errorMessage , updateCourseDto ] = UpdateCourseDto.create( id , req.body );
        if( errorMessage ) return HandlerResponses.handleError( CustomError.badRequest( errorMessage ) , res );
        console.log(updateCourseDto)
        new UpdateCourse( this.courseRepository , this.fileRepository , this.categoryRepository  )
            .execute( updateCourseDto! , fileUploadDto )
            .then( courseUpdated => HandlerResponses.handleSuccess( res , courseUpdated, 200 ) )
            .catch( error => HandlerResponses.handleError( error , res ) );
    }


    public deleteCourse = ( req : Request , res : Response ) => {

        const { id } = req.params;

        new DeleteCourse( this.courseRepository )
            .execute( id )
            .then( hasBeenRemoved => HandlerResponses.handleSuccess( res , 
                                                                            { 
                                                                                removed: hasBeenRemoved
                                                                            }, 
                                                                    200) )
            .catch( error => HandlerResponses.handleError(error , res) );
    }
}