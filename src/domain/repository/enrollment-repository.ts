import { EnrollmentEntity } from "../entities/enrollment.entity";

import { CreateEnrollmentDto } from "../dtos/enrollment/create-enrollment.dto";
import { EnrollmentDetailedResponseDto, UpdateEnrollmentDto } from "../dtos/enrollment/enrollment.response.dto";
import { TransactionSession } from "../services/UnitOfWork";

export abstract class EnrollmentRepository {
    
    abstract findAllEnrollments( ) : Promise<EnrollmentEntity[]>;
    abstract findEnrollmentsByUserId( uid : string ) : Promise<EnrollmentDetailedResponseDto[]>;
    abstract findEnrollmentByUserIdAndCourseId( id_user : string , id_course : string ) : Promise<EnrollmentEntity | null>;
    abstract saveEnrollment( enrollmentDto : CreateEnrollmentDto , ts ?: TransactionSession ) : Promise<EnrollmentEntity>;
    abstract updateEnrollment( enrollment : UpdateEnrollmentDto ) : Promise<EnrollmentEntity>;

}