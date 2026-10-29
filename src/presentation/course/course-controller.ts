import { Request, Response } from "express";

import { CourseRepository } from "../../domain/repository/course-repository";
import { DeleteCourse, FindAllCourses, FindCourseById, SaveCourse, UpdateCourse } from '../../domain/use-cases';
import { CreateCourseDto , UpdateCourseDto } from "../../domain/dtos";
import { buildPaginationResponse } from "../../domain/dtos/shared/pagination.dto";
import { HandlerResponses } from '../helpers/handler-responses';
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { FindCoursesByCategory } from "../../domain/use-cases/course/find-courses-by-category";
import { CategoryRepository } from "../../domain/repository/category-repository";
import { FileRepository } from "../../domain/repository/file-repository";
import { CustomError } from "../../domain/errors/custom-error";
import { regularExps } from "../../domain/helpers/regular.exp";
import { FindCoursesByIds } from "../../domain/use-cases/course/find-courses-by-ids";
import { CourseFilterRequest } from "../middlewares";

const COURSES_BASE_PATH = '/api/courses';

export class CourseController {

    constructor (
        private readonly courseRepository : CourseRepository,
        private readonly categoryRepository : CategoryRepository,
        private readonly fileRepository : FileRepository,
    ){ }

    public findAllCourses = ( req : CourseFilterRequest , res : Response ) => {
        const { courseFilter , pagination } = req;
        if( !courseFilter || !pagination ) {
            return HandlerResponses.handleError(
                CustomError.internalServer('La ruta debe incluir los middlewares de filtros y paginación.') , res );
        }

        new FindAllCourses( this.courseRepository )
            .execute( courseFilter , pagination )
            .then( ({ items , total }) => HandlerResponses.handleSuccess(
                                                res,
                                                buildPaginationResponse({
                                                    items,
                                                    total,
                                                    pagination,
                                                    basePath : COURSES_BASE_PATH,
                                                }),
                                                200 ) )
            .catch( error => HandlerResponses.handleError( error , res ));
    }

    public findCoursesByIds = ( req : Request , res : Response ) => {
        const { ids } = req.query;
        if( typeof ids !== 'string' || ids.trim().length === 0 ) {
            return HandlerResponses.handleError( CustomError.badRequest('Debes indicar los ids de los cursos a buscar en el parámetro "ids".'), res);
        }

        const id_courses = ids.split(',').map( id => id.trim() ).filter( id => id.length > 0 );
        if( id_courses.length === 0 ) {
            return HandlerResponses.handleError( CustomError.badRequest('Debes indicar al menos un id de curso.'), res);
        }

        const invalidIds = id_courses.filter( id => !regularExps.isValidId.test( id ) );
        if( invalidIds.length > 0 ) {
            return HandlerResponses.handleError( CustomError.badRequest(`Los siguientes ids no son válidos: ${ invalidIds.join(', ') }.`), res);
        }

        new FindCoursesByIds( this.courseRepository )
            .execute( id_courses )
            .then( courses => HandlerResponses.handleSuccess( res , courses , 200) )
            .catch( error => HandlerResponses.handleError( error , res ));
    }

    public findCourseById = ( req : Request , res : Response ) => {
        if( typeof req.params.id !== 'string' || !req.params.id ) {
            return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id valido.') , res );
        }

        const { id }  = req.params;

        new FindCourseById( this.courseRepository )
            .execute( id )
            .then( course => HandlerResponses.handleSuccess( res, course, 200 ) )
            .catch( error => HandlerResponses.handleError( error , res ));
    }

    public findCoursesByCategory = ( req : Request , res : Response ) => {
        if( typeof req.params.slug !== 'string' || !req.params.slug ) {
            return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un slug valido.') , res );
        }

        const { slug } = req.params;

        new FindCoursesByCategory( this.courseRepository , this.categoryRepository )
            .execute( slug )
            .then( course => HandlerResponses.handleSuccess( res, course, 200 ) )
            .catch( error => HandlerResponses.handleError( error , res ));

    }

    public saveCourse = ( req : AuthenticatedRequest , res : Response ) => {
        const [ errorMessage , createCourseDto ] = CreateCourseDto.create( req.body );
        if( errorMessage ) return HandlerResponses.handleError( CustomError.badRequest( errorMessage ) , res );

        new SaveCourse( this.courseRepository , this.categoryRepository )
            .execute( createCourseDto! )
            .then( courseCreated => HandlerResponses.handleSuccess( res, courseCreated , 201 ) )
            .catch( error => HandlerResponses.handleError( error , res ));
    }

    public updateCourse = ( req : AuthenticatedRequest , res : Response ) => {
        const { user } = req;
        if( !user ) return HandlerResponses.handleError( CustomError.unauthorized('Debes estar autenticado para editar un curso.') , res );

        const fileUploadDto = req.body.attachedFile;
        if( typeof req.params.id !== 'string' || !req.params.id ) {
            return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id valido.') , res );
        }
        const { id } = req.params;

        const [ errorMessage , updateCourseDto ] = UpdateCourseDto.create( id , req.body );
        if( errorMessage ) return HandlerResponses.handleError( CustomError.badRequest( errorMessage ) , res );

        new UpdateCourse( this.courseRepository , this.fileRepository , this.categoryRepository  )
            .execute( updateCourseDto! , user.id , user.role , fileUploadDto )
            .then( courseUpdated => HandlerResponses.handleSuccess( res , courseUpdated, 200 ) )
            .catch( error => HandlerResponses.handleError( error , res ) );
    }


    public deleteCourse = ( req : AuthenticatedRequest , res : Response ) => {
        const { user } = req;
        if( !user ) return HandlerResponses.handleError( CustomError.unauthorized('Debes estar autenticado para eliminar un curso.') , res );

        if( typeof req.params.id !== 'string' || !req.params.id ) {
            return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id valido.') , res );
        }
        const { id } = req.params;

        new DeleteCourse( this.courseRepository )
            .execute( id , user.id , user.role )
            .then( hasBeenRemoved => HandlerResponses.handleSuccess( res ,
                                                                            {
                                                                                removed: hasBeenRemoved
                                                                            },
                                                                    200) )
            .catch( error => HandlerResponses.handleError(error , res) );
    }
}
