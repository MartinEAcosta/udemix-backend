import { LessonEntity } from "../../entities/lesson.entity";
import { CustomError } from "../../errors/custom-error";
import { LessonRepository } from "../../repository/lesson-repository";

interface FindAllLessonFromCourseUseCase {
    execute( course_id : string ) : Promise<LessonEntity[]>;
}

export class FindAllLessonFromCourse implements FindAllLessonFromCourseUseCase {

    constructor(
        private readonly lessonRepository : LessonRepository,
    ) { }

    async execute( course_id : string ) : Promise<LessonEntity[]> {
        const lessons = this.lessonRepository.findAllLessonsByCourseId( course_id );
        if( !lessons ) throw CustomError.internalServer('Hubo un error al recopilar los lecciones.');

        return lessons;
    }


}