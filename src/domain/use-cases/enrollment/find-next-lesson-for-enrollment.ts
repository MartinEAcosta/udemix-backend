import { LessonResponsePopulateDto } from "../../dtos/lesson/lesson.response.dto";
import { CustomError } from "../../errors/custom-error";
import { EnrollmentRepository, LessonRepository } from "../../repository";

interface FindNextLessonForEnrollmentUseCase {
    execute ( id_enrollment : string , id_user : string ) : Promise<LessonResponsePopulateDto>;
}

export class FindNextLessonForEnrollment implements FindNextLessonForEnrollmentUseCase {

    constructor(
        private readonly enrollmentReposiotory : EnrollmentRepository,
        private readonly lessonRepository      : LessonRepository,
    ){ }
    
    async execute( id_enrollment : string , id_user : string ) : Promise<LessonResponsePopulateDto> {

        const enrollment = await this.enrollmentReposiotory.findEnrollmentById( id_enrollment );
        if( !enrollment ) throw CustomError.notFound('No se encontró la inscripción asociada al id.');
        if( enrollment.id_user !== id_user ) throw CustomError.unauthorized('No puedes buscar la próxima lección de una inscripción que no te pertenece.');
        if( enrollment.completed_lessons.length === 0 ){ 
            const firstLesson = await this.lessonRepository.findLessonByLessonNumber( enrollment.id_course , 0 );
            console.log(firstLesson);
            if( !firstLesson ) throw CustomError.notFound('No se encontró la primera lección del curso asociado a la inscripción.');
            return {
                ...firstLesson,
            } 
        }
        const last = enrollment.completed_lessons[ enrollment.completed_lessons.length - 1 ];
        console.log(enrollment.completed_lessons)
        console.log(last);
        const lastLesson = await this.lessonRepository.findLessonById( last );
        if( !lastLesson ) throw CustomError.notFound( 'Hubo un error de sincronización al buscar la ultima lección.');

        const nextLesson = await this.lessonRepository.findLessonByLessonNumber( enrollment.id_course , lastLesson.lesson_number+1 );
        if( !nextLesson ) throw CustomError.notFound('No se encontró la siguiente lección del curso asociado a la inscripción.');

        return {
            ...nextLesson,
        } 
    }

}