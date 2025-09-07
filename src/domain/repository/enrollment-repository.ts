import { EnrollmentEntity } from "../entities/enrollment.entity";

import { CreateEnrollmentDto } from "../dtos/enrollment/create-enrollment.dto";

export abstract class EnrollmentRepository {

    abstract saveEnrollment( enrollmentDto : CreateEnrollmentDto ) : Promise<EnrollmentEntity>;
    abstract findEnrollmentByUserIdAndCourseId( id_user : string , id_course : string ) : Promise<EnrollmentEntity | null>;
    abstract findAllEnrollmentsByUserId( uid : string ) : Promise<EnrollmentEntity[]>;

}