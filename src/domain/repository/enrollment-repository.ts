import { EnrollmentEntity } from "../entities/enrollment.entity";

import { CreateEnrollmentDto } from "../dtos/enrollment/create-enrollment.dto";

export abstract class EnrollmentRepository {
    
    abstract findAllEnrollments( ) : Promise<EnrollmentEntity[]>;
    abstract findEnrollmentsByUserId( uid : string ) : Promise<EnrollmentEntity[]>;
    abstract saveEnrollment( enrollmentDto : CreateEnrollmentDto ) : Promise<EnrollmentEntity>;
    abstract findEnrollmentByUserIdAndCourseId( id_user : string , id_course : string ) : Promise<EnrollmentEntity | null>;

}