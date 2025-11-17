import { EnrollmentEntity } from "../../entities/enrollment.entity";
import { CustomError } from "../../errors/custom-error";
import { AuthRepository, CourseRepository, EnrollmentRepository, LessonRepository, ModuleRepository } from "../../repository";

interface MarkLessonAsCompletedUseCase {
    execute ( id_course : string , id_lesson : string , id_user : string ) : Promise<EnrollmentEntity>;
}

export class MarkLessonAsCompleted implements MarkLessonAsCompletedUseCase {

    constructor(
        private readonly enrollmentRepository : EnrollmentRepository,
        private readonly courseRepository : CourseRepository,
        private readonly lessonRepository : LessonRepository, 
        private readonly moduleRepository : ModuleRepository,
        private readonly userRepository : AuthRepository,
    ) { }

    async execute ( id_course : string , id_lesson : string , id_user : string ) : Promise<EnrollmentEntity> {

        const course = await this.courseRepository.findCourseById(id_course);
        if( !course ) throw CustomError.internalServer('El curso que indicas no existe.');
        
        const lesson = await this.lessonRepository.findLessonById( id_lesson );
        if( !lesson ) throw CustomError.internalServer('La lección que quieres marcar como completada no existe.');
    
        const user = await this.userRepository.findUserById( id_user );
        if( !user ) throw CustomError.internalServer('El usuario asignado a la inscripción no existe.');

        const enrollment = await this.enrollmentRepository.findEnrollmentByUserIdAndCourseId( id_user , id_course );
        if( !enrollment ) throw CustomError.notFound('No estás inscrito en el curso indicado.');

        if( enrollment.completed_lessons.includes( id_lesson ) ) {
            throw CustomError.badRequest('La lección ya ha sido marcada como completada anteriormente.');
        }
        enrollment.completed_lessons.push( id_lesson );

        const modules = await this.moduleRepository.findModulesByCourseId( id_course );
        const totalLessons = modules.reduce( ( total , module ) => { return total + module.lessons.length } , 0 );
        enrollment.progress = ( enrollment.completed_lessons.length / totalLessons ) * 100;

        return await this.enrollmentRepository.updateEnrollment( enrollment );
    }

}