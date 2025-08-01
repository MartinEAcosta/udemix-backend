import { IEnrollmentModel } from "../../data";
import { CreateEnrollmentDto } from "../dtos/enrollment/create-enrollment.dto";

export abstract class EnrollmentDatasource {

    abstract saveEnrollment( enrollmentDto : CreateEnrollmentDto ) : Promise<IEnrollmentModel>;
    // Se encarga de retornar la lista de cursos a los que esta inscripto el usuario,
    // dado su id.
    abstract getAllEnrollmentsByUserId( uid : string ) : Promise<IEnrollmentModel[] | undefined>;
    abstract getEnrollmentByUserIdAndCourseId( uid : string , courseId : string ) : Promise<IEnrollmentModel| null>;
    

}