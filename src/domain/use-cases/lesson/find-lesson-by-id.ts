import { LessonEntity } from "../../entities/lesson.entity";
import { CustomError } from "../../errors/custom-error";
import { LessonRepository } from "../../repository/lesson-repository";

interface FindLessonByIdUseCase {
    execute( id : string ) : Promise<LessonEntity>;
}

export class FindLessonById implements FindLessonByIdUseCase {

    constructor( 
        private readonly lessonRepository : LessonRepository,
    ) { }

    async execute( id : string ) : Promise<LessonEntity> {
        const lesson = await this.lessonRepository.findLessonById( id ); 
        if( !lesson ) throw CustomError.notFound('No se ha encontrado la lección indicada.');

        return lesson;
    }


}