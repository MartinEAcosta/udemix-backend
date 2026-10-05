import { LessonResponsePopulateDto } from "../../dtos/lesson/lesson.response.dto";
import { CustomError } from "../../errors/custom-error";
import { CourseRepository } from "../../repository/course-repository";
import { EnrollmentRepository } from "../../repository/enrollment-repository";
import { LessonRepository } from "../../repository/lesson-repository";

interface FindLessonPopulatedByIdUseCase {
    execute( id : string , id_user : string , role : string ) : Promise<LessonResponsePopulateDto>;
}

export class FindLessonPopulatedById implements FindLessonPopulatedByIdUseCase {

    constructor(
        private readonly lessonRepository : LessonRepository,
        private readonly courseRepository : CourseRepository,
        private readonly enrollmentRepository : EnrollmentRepository,
    ) { }

    async execute( id : string , id_user : string , role : string ) : Promise<LessonResponsePopulateDto> {
        const lesson = await this.lessonRepository.findLessonPopulatedById( id );
        if( !lesson ) throw CustomError.notFound('No se ha encontrado la lección indicada.');

        const course = await this.courseRepository.findCourseById( lesson.id_course );
        if( !course ) throw CustomError.notFound('El curso al que pertenece la lección no existe.');

        if( role !== 'admin' && course.id_owner != id_user ) {
            const enrollment = await this.enrollmentRepository.findEnrollmentByUserIdAndCourseId( id_user , course.id );
            if( !enrollment ) throw CustomError.unauthorized('Debes estar inscrito en el curso para ver este contenido.');
        }

        return lesson;
    }


}