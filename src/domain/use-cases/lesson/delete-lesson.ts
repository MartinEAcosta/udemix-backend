import { LessonRepository } from "../../repository/lesson-repository";

interface DeleteLessonUseCase {
    execute( id : string ) : Promise<boolean>;
}

export class DeleteLesson implements DeleteLessonUseCase {

    constructor( 
        private readonly lessonRepository : LessonRepository,
    ) { }


    async execute( id : string ) : Promise<boolean> {
        const hasDeleted = await this.lessonRepository.deleteLesson( id );

        return hasDeleted;
    }

    
}