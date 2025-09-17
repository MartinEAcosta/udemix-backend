import { EnrollmentEntity } from "../../entities/enrollment.entity";
import { EnrollmentRepository } from "../../repository/enrollment-repository";

interface FindAllEnrollmentsUseCase {
    execute ( ) : Promise<EnrollmentEntity[]>;
}

export class FindAllEnrollments implements FindAllEnrollmentsUseCase {

    constructor( 
        private readonly enrollmentRepository : EnrollmentRepository
     ) { }

    async execute( ) : Promise<EnrollmentEntity[]> {

        const enrollments = this.enrollmentRepository.findAllEnrollments()
        
        return enrollments;
    }
    
}