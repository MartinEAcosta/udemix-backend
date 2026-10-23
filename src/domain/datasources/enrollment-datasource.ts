import { CreateEnrollmentRequestDTO } from "../dtos/enrollment/create-enrollment.dto";
import { EnrollmentDetailedResponseDTO, EnrollmentResponseDTO, UpdateEnrollmentRequestDTO } from '../dtos/enrollment/enrollment.response.dto';

export abstract class EnrollmentDatasource {

    abstract findAllEnrollments() : Promise<EnrollmentResponseDTO[]>;
    abstract findEnrollmentById( id_enrollment : string ) : Promise<EnrollmentResponseDTO | null>;
    abstract findEnrollmentPopulatedById( id_enrollment : string ) : Promise<EnrollmentDetailedResponseDTO | null>;
    abstract findEnrollmentsByUserId( uid : string ) : Promise<EnrollmentDetailedResponseDTO[] | undefined>;
    abstract findEnrollmentByUserIdAndCourseId( uid : string , courseId : string ) : Promise<EnrollmentResponseDTO| null>;
    abstract saveEnrollment( enrollmentRequestDTO : CreateEnrollmentRequestDTO ) : Promise<EnrollmentResponseDTO>;
    abstract updateEnrollment( enrollmentRequestDTO : UpdateEnrollmentRequestDTO ) : Promise<EnrollmentResponseDTO>;

}