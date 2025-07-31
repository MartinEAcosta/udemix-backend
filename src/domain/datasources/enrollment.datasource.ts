import { IEnrollmentModel } from "../../data";

export abstract class EnrollmentDatasource {

    // Se encarga de retornar la lista de cursos a los que esta inscripto el usuario,
    // dado su id.
    abstract getAllEnrollmentsByUserId( uid : string ) : Promise<IEnrollmentModel>;

}