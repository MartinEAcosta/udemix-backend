import { CustomError } from "../../errors/custom-error";
import { EnrollmentDetailedResponseDto } from "../../dtos/enrollment/enrollment.response.dto";
import { EnrollmentRepository } from "../../repository";

interface FindEnrollmentPopulatedUseCase {
    execute( id_enrollment : string, id_user : string, role : string ) : Promise<EnrollmentDetailedResponseDto | null>;
}

export class FindEnrollmentPopulatedById implements FindEnrollmentPopulatedUseCase {

    constructor(
        private readonly enrollmentRepository : EnrollmentRepository,
    ) { }

    async execute( id_enrollment : string, id_user : string, role : string ) : Promise<EnrollmentDetailedResponseDto | null> {
        const enrollment = await this.enrollmentRepository.findEnrollmentPopulatedById( id_enrollment );
        if( !enrollment ) return null;

        if( enrollment.id_user != id_user && role !== 'admin' ) {
            throw CustomError.unauthorized('No puedes buscar una inscripción que no te pertenece');
        }

        return enrollment;
    }

}