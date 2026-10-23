import { EnrollmentEntity } from "../entities/enrollment.entity";

import { CreateEnrollmentRequestDTO } from "../dtos/enrollment/create-enrollment.dto";
import { EnrollmentDetailedResponseDTO, UpdateEnrollmentRequestDTO } from "../dtos/enrollment/enrollment.response.dto";
import { TransactionSession } from "../services/UnitOfWork";

export abstract class EnrollmentRepository {

    abstract findAllEnrollments( ) : Promise<EnrollmentEntity[]>;
    abstract findEnrollmentById( id_enrollment : string ) : Promise<EnrollmentEntity | null>;
    abstract findEnrollmentPopulatedById( id_enrollment : string ) : Promise<EnrollmentDetailedResponseDTO | null>;
    abstract findEnrollmentsByUserId( uid : string ) : Promise<EnrollmentDetailedResponseDTO[]>;
    abstract findEnrollmentByUserIdAndCourseId( id_user : string , id_course : string ) : Promise<EnrollmentEntity | null>;
    abstract saveEnrollment( enrollmentRequestDTO : CreateEnrollmentRequestDTO , ts ?: TransactionSession ) : Promise<EnrollmentEntity>;
    abstract updateEnrollment( enrollment : UpdateEnrollmentRequestDTO ) : Promise<EnrollmentEntity>;

}