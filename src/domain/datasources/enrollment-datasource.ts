import { CreateEnrollmentDto } from "../dtos/enrollment/create-enrollment.dto";
import { EnrollmentDetailedResponseDto, EnrollmentResponseDto, UpdateEnrollmentDto } from '../dtos/enrollment/enrollment.response.dto';

export abstract class EnrollmentDatasource {

    abstract findAllEnrollments() : Promise<EnrollmentResponseDto[]>;
    abstract findEnrollmentById( id_enrollment : string ) : Promise<EnrollmentResponseDto | null>;
    abstract findEnrollmentsByUserId( uid : string ) : Promise<EnrollmentDetailedResponseDto[] | undefined>;
    abstract findEnrollmentByUserIdAndCourseId( uid : string , courseId : string ) : Promise<EnrollmentResponseDto| null>;
    abstract saveEnrollment( enrollmentDto : CreateEnrollmentDto ) : Promise<EnrollmentResponseDto>;
    abstract updateEnrollment( enrollmentDto : UpdateEnrollmentDto ) : Promise<EnrollmentResponseDto>;

}