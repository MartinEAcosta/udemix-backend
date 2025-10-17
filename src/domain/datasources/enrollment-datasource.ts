import { CreateEnrollmentDto } from "../dtos/enrollment/create-enrollment.dto";
import { EnrollmentDetailedResponseDto, EnrollmentResponseDto } from '../dtos/enrollment/enrollment.response.dto';

export abstract class EnrollmentDatasource {

    abstract findAllEnrollments() : Promise<EnrollmentResponseDto[]>;
    abstract findEnrollmentsByUserId( uid : string ) : Promise<EnrollmentDetailedResponseDto[] | undefined>;
    abstract saveEnrollment( enrollmentDto : CreateEnrollmentDto ) : Promise<EnrollmentResponseDto>;
    abstract findEnrollmentByUserIdAndCourseId( uid : string , courseId : string ) : Promise<EnrollmentResponseDto| null>;

}