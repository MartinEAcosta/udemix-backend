import { LessonRepository } from "../../repository/lesson-repository";
import { CourseRepository } from "../../repository/course-repository";
import { CustomError } from "../../errors/custom-error";

interface DeleteLessonUseCase {
    execute( id : string , id_user : string ) : Promise<boolean>;
}

export class DeleteLesson implements DeleteLessonUseCase {

    constructor(
        private readonly lessonRepository : LessonRepository,
        private readonly courseRepository : CourseRepository,
    ) { }


    async execute( id : string , id_user : string ) : Promise<boolean> {
        const lesson = await this.lessonRepository.findLessonById( id );
        if( !lesson ) throw CustomError.notFound("La lección que intentas eliminar no existe.");

        const course = await this.courseRepository.findCourseById( lesson.id_course );
        if( !course ) throw CustomError.notFound("El curso al que pertenece la lección no existe.");

        if( course.id_owner != id_user ) throw CustomError.unauthorized('No puedes eliminar una lección de un curso que no te pertenece.');

        const hasDeleted = await this.lessonRepository.deleteLesson( id );

        return hasDeleted;
    }


}