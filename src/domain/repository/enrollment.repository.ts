import { CreateEnrollmentDto } from "../dtos/enrollment/create-enrollment.dto";
import { EnrollmentEntity } from "../entities/enrollment.entity";

export abstract class EnrollmentRepository {

    abstract saveEnrollment( enrollmentDto : CreateEnrollmentDto ) : Promise<EnrollmentEntity>;
    abstract getAllEnrollmentsByUserId( uid : string ) : Promise<EnrollmentEntity>;
    abstract getEnrollmentByUserIdAndCourseId( uid : string , courseId : string ) : Promise<EnrollmentEntity | null>;

}