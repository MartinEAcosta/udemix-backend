import { EnrollmentEntity } from "../entities/enrollment.entity";

import { CreateEnrollmentDto } from "../dtos/enrollment/create-enrollment.dto";

export abstract class EnrollmentRepository {

    abstract saveEnrollment( enrollmentDto : CreateEnrollmentDto ) : Promise<EnrollmentEntity>;
    abstract getEnrollmentByUserIdAndCourseId( uid : string , courseId : string ) : Promise<EnrollmentEntity | null>;
    abstract getAllEnrollmentsByUserId( uid : string ) : Promise<EnrollmentEntity[]>;

}