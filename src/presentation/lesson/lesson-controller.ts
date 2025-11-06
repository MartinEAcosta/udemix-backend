import { Request, Response } from "express";

import { LessonRepository } from "../../domain/repository/lesson-repository";
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";

import { CreateLesson } from "../../domain/use-cases/lesson/create-lesson";
import { CreateLessonDto } from "../../domain/dtos/lesson/create-lesson.dto";
import { FindAllLessonsFromCourse } from "../../domain/use-cases/lesson/find-all-lessons-from-course";
import { DeleteLesson } from "../../domain/use-cases/lesson/delete-lesson";
import { FindLessonById } from "../../domain/use-cases/lesson/find-lesson-by-id";
import { CourseRepository } from "../../domain/repository/course-repository";
import { AuthenticatedRequest } from "../middlewares/auth.middleware";
import { UpdateLessonDto } from "../../domain/dtos/lesson/update-lesson.dto";
import { UpdateLesson } from "../../domain/use-cases/lesson/update-lesson";
import { FileRepository } from "../../domain/repository/file-repository";
import { ModuleRepository } from "../../domain/repository/module-repository";
import { UnitOfWork } from "../../domain/services/UnitOfWork";


export class LessonController {

    constructor( 
        private readonly lessonRepository : LessonRepository,
        private readonly moduleRepository : ModuleRepository,
        private readonly courseRepository : CourseRepository,
        private readonly fileRepository   : FileRepository,
        private readonly unitOfWork       : UnitOfWork,
    ) { }

    public createLesson = ( req : AuthenticatedRequest , res : Response ) => {
        const fileUploadDto = req.body.attachedFile;

        const { user } = req;
        if( !user ) throw HandlerResponses.handleError( CustomError.unauthorized( 'Debes estar autenticado para crear una lección.' ), res );
        const [ error, lessonRequestDto ] = CreateLessonDto.create(
                                                                    {   
                                                                        ...req.body,
                                                                    });
        if( error ) throw HandlerResponses.handleError( CustomError.badRequest( error ), res );

        new CreateLesson( this.lessonRepository , this.moduleRepository , this.courseRepository , this.fileRepository , this.unitOfWork )
                .execute( lessonRequestDto! , user.id , fileUploadDto  )
                .then( success => HandlerResponses.handleSuccess( res , success , 201 ))
                .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

    public updateLesson = ( req : AuthenticatedRequest , res : Response ) =>{

        const { id } = req.params;
        if( !id ) return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id para realizar el borrado.'), res );

        const { user } = req;
        if( !user ) throw HandlerResponses.handleError( CustomError.unauthorized( 'Debes estar autenticado para crear una lección.' ), res );
        const [ error , lessonRequestDto ] = UpdateLessonDto.create(
                                                                    { 
                                                                        ...req.body,
                                                                        id_user : user.id
                                                                    });
        if( error ) throw HandlerResponses.handleError( CustomError.badRequest( error ), res );

        
        new UpdateLesson( this.courseRepository , this.lessonRepository )
                .execute( lessonRequestDto! )
                .then( success => HandlerResponses.handleSuccess( res , success , 200 ))
                .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

    public deleteLesson = ( req : Request , res : Response ) => {

        const { id } = req.params;
        if( !id ) return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id para realizar el borrado.'), res );

        new DeleteLesson( this.lessonRepository )
            .execute( id )
            .then( success => HandlerResponses.handleSuccess( res , success , 200 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});

    }

    public findAllLessonsFromCourse = ( req : Request , res : Response ) => {

        const { course_id } = req.params;
        if( !course_id ) return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id de curso valido.') , res );

        new FindAllLessonsFromCourse( this.courseRepository , this.lessonRepository )
            .execute( course_id )
            .then( success => HandlerResponses.handleSuccess( res , success , 200 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
        
    }

    public findLessonById = ( req : Request , res : Response ) => {

        const { id } = req.params;
        if( !id ) return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id.'), res );

        new FindLessonById( this.lessonRepository )
            .execute( id )                    
            .then( success => HandlerResponses.handleSuccess( res , success , 200 ))
            .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});

    }

}