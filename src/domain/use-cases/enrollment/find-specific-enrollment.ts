import { EnrollmentEntity } from "../../entities/enrollment.entity";
import { CustomError } from "../../errors/custom-error";
import { AuthRepository, CourseRepository, EnrollmentRepository } from "../../repository";

interface FindSpecificEnrollmentUseCase {
    execute ( id_user : string , id_course : string ) : Promise<EnrollmentEntity | null>;
}

export class FindSpecificEnrollment implements FindSpecificEnrollmentUseCase {

    constructor (
        private readonly enrollmentRepository : EnrollmentRepository,
        private readonly authRepository       : AuthRepository,
        private readonly courseRepository     : CourseRepository,
        
    ) {}

    async execute( id_user : string , id_course : string ) : Promise<EnrollmentEntity | null> {

        const user = this.authRepository.findUserById( id_user ); 
        if( !user ) throw CustomError.notFound('No se encontró el usuario a obtener la inscripción.');

        const course = this.courseRepository.findCourseById( id_course );
        if( !course ) throw CustomError.notFound('No se encontró el curso a obtener la inscripción.');

        const enrollment = this.enrollmentRepository.findEnrollmentByUserIdAndCourseId( id_user , id_course );
        if( !enrollment ) throw CustomError.notFound('No se encontró la inscripción asociada a los parametros ingresados.');

        return enrollment;
    }


}