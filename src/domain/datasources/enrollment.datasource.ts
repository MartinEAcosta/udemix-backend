import { CreateEnrollmentDto } from "../dtos/enrollment/create-enrollment.dto";
import { EnrollmentResponseDto } from '../dtos/enrollment/enrollment.response.dto';

export abstract class EnrollmentDatasource {

    abstract saveEnrollment( enrollmentDto : CreateEnrollmentDto ) : Promise<EnrollmentResponseDto>;
    // Se encarga de retornar la lista de cursos a los que esta inscripto el usuario,
    // dado su id.
    // TODO: verificar el retorno creo que esta mal
    abstract findAllEnrollmentsByUserId( uid : string ) : Promise<EnrollmentResponseDto[] | undefined>;
    abstract findEnrollmentByUserIdAndCourseId( uid : string , courseId : string ) : Promise<EnrollmentResponseDto| null>;

}