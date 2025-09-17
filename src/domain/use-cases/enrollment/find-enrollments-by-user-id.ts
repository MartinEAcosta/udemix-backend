import { EnrollmentEntity } from "../../entities/enrollment.entity";
import { CustomError } from "../../errors/custom-error";
import { EnrollmentRepository } from "../../repository/enrollment-repository";

interface FindEnrollmentsByUserIdUseCase {
    execute ( id_user : string ) : Promise<EnrollmentEntity[]>;
}

export class FindEnrollmentsByUserId implements FindEnrollmentsByUserIdUseCase {

    constructor( private readonly enrollmentRepository : EnrollmentRepository ) {

    }

    async execute( id_user: string ) : Promise<EnrollmentEntity[]> {
        
        const enrollmentsOfUser = await this.enrollmentRepository.findEnrollmentsByUserId( id_user );
        if( !enrollmentsOfUser ) throw CustomError.notFound( "No se han encontrado inscripciones asociadas al usuario.");

        return enrollmentsOfUser;
    }
}