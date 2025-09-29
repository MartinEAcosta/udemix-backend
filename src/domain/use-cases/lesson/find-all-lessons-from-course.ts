import { LessonResponsePopulateDto } from "../../dtos/lesson/lesson.response.dto";
import { LessonEntity } from "../../entities/lesson.entity";
import { CustomError } from "../../errors/custom-error";
import { CourseRepository } from "../../repository/course-repository";
import { LessonRepository } from "../../repository/lesson-repository";

interface FindAllLessonsFromCourseUseCase {
    execute( course_id : string ) : Promise<LessonResponsePopulateDto[]>;
}

export class FindAllLessonsFromCourse implements FindAllLessonsFromCourseUseCase {

    constructor(
        private readonly courseRepository : CourseRepository,
        private readonly lessonRepository : LessonRepository,
    ) { }

    async execute( course_id : string ) : Promise<LessonResponsePopulateDto[]> {
        
        const course = await this.courseRepository.findCourseById( course_id );
        if( !course ) throw CustomError.notFound("El curso en el que buscas lecciones no existe.");

        const lessons = await this.lessonRepository.findAllLessonsPopulatedByCourseId( course_id );
        if( !lessons ) throw CustomError.internalServer('Hubo un error al recopilar los lecciones.');
        return lessons;
    }


}