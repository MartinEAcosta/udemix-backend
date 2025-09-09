import { Request, Response } from "express";

import { LessonRepository } from "../../domain/repository/lesson-repository";
import { HandlerResponses } from "../helpers/handler-responses";
import { CustomError } from "../../domain/errors/custom-error";

import { CreateLesson } from "../../domain/use-cases/lesson/create-lesson";
import { CreateLessonDto } from "../../domain/dtos/lesson/create-lesson.dto";
import { FindAllLessonFromCourse } from "../../domain/use-cases/lesson/find-all-lesson-from-course";


export class LessonController {

    constructor( 
        private readonly lessonRepository : LessonRepository,
    ) { }

    public createLesson = ( req : Request , res : Response ) => {

        const { id_course, title, description, id_file,
                unit, chapter, lesson_number, uploaded_at
                } = req.body;
        const [ error, lessonRequestDto ] = CreateLessonDto.create({
                                                                    id_course, title, description, id_file,
                                                                    unit, chapter, lesson_number, uploaded_at
                                                                });
        if( error ) throw HandlerResponses.handleError( CustomError.badRequest( error ), res );

        new CreateLesson( this.lessonRepository )
                .execute( lessonRequestDto! )
                    .then( success => HandlerResponses.handleSuccess( res , success , 201 ))
                    .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
    }

    public findAllLessonFromCourse = ( req : Request , res : Response ) => {

        const { course_id } = req.params;
        if( !course_id ) return HandlerResponses.handleError( CustomError.badRequest('Debes indicar un id de curso valido.') , res );

        new FindAllLessonFromCourse( this.lessonRepository )
            .execute( course_id )
                    .then( success => HandlerResponses.handleSuccess( res , success , 200 ))
                    .catch( error => { console.log(error); return HandlerResponses.handleError( error , res )});
        
    }

}