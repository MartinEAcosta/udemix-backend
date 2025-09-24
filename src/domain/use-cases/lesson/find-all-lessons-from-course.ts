import { LessonEntity } from "../../entities/lesson.entity";
import { CustomError } from "../../errors/custom-error";
import { LessonRepository } from "../../repository/lesson-repository";

interface FindAllLessonsFromCourseUseCase {
    execute( course_id : string ) : Promise<LessonEntity[]>;
}

export class FindAllLessonsFromCourse implements FindAllLessonsFromCourseUseCase {

    constructor(
        private readonly lessonRepository : LessonRepository,
    ) { }

    async execute( course_id : string ) : Promise<LessonEntity[]> {
        const course = await this.lessonRepository.findLessonById( course_id );
        if( !course ) throw CustomError.notFound("El curso en el que buscas lecciones no existe.");

        const lessons = await this.lessonRepository.findAllLessonsByCourseId( course_id );
        if( !lessons ) throw CustomError.internalServer('Hubo un error al recopilar los lecciones.');
        
        return lessons;
    }


}