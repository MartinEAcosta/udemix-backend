import { LessonResponsePopulateDto } from "../../dtos/lesson/lesson.response.dto";
import { CustomError } from "../../errors/custom-error";
import { LessonRepository } from "../../repository/lesson-repository";

interface FindLessonPopulatedByIdUseCase {
    execute( id : string ) : Promise<LessonResponsePopulateDto>;
}

export class FindLessonPopulatedById implements FindLessonPopulatedByIdUseCase {

    constructor( 
        private readonly lessonRepository : LessonRepository,
    ) { }

    async execute( id : string ) : Promise<LessonResponsePopulateDto> {
        const lesson = await this.lessonRepository.findLessonPopulatedById( id ); 
        if( !lesson ) throw CustomError.notFound('No se ha encontrado la lección indicada.');

        return lesson;
    }


}