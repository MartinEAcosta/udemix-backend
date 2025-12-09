import { EnrollmentDetailedResponseDto } from "../../dtos/enrollment/enrollment.response.dto";
import { EnrollmentRepository } from "../../repository";

interface FindEnrollmentPopulatedUseCase {
    execute( id_enrollment : string ) : Promise<EnrollmentDetailedResponseDto>;
}

export class FindEnrollmentPopulatedById implements FindEnrollmentPopulatedUseCase {

    constructor(
        private readonly enrollmentRepository : EnrollmentRepository,
    ) { }
    
    async execute( id_enrollment : string ) : Promise<EnrollmentDetailedResponseDto> {
        
        const enrollment = await this.enrollmentRepository.findEnrollmentPopulatedById( id_enrollment )

        throw new Error("Method not implemented.");
    }
    
}