import { EnrollmentEntity } from "../entities/enrollment.entity";



export abstract class EnrollmentRepository {

    abstract getAllEnrollmentsByUserId( uid : string ) : Promise<EnrollmentEntity>;
    
}