import { CreateEnrollmentDto } from "../../dtos/enrollment/create-enrollment.dto";
import { EnrollmentEntity } from "../../entities/enrollment.entity";
import { CustomError } from "../../errors/custom-error";
import { EnrollmentRepository } from "../../repository/enrollment.repository";

export interface SaveEnrollmentUseCase {
    execute( enrollmentDto : CreateEnrollmentDto ) : Promise<EnrollmentEntity>;
}

export class SaveEnrollment implements SaveEnrollmentUseCase {

    constructor( private readonly enrollmentRepository : EnrollmentRepository ){}

    execute = async(enrollmentDto: CreateEnrollmentDto): Promise<EnrollmentEntity> => {
        const existEnrollment = await this.enrollmentRepository.getEnrollmentByUserIdAndCourseId( enrollmentDto.id_user , enrollmentDto.id_course );
        if( existEnrollment ) throw CustomError.badRequest(`El usuario ya se encuentra inscrito en el curso con id: ${ enrollmentDto.id_course }`);

        const savedEnrollment = await this.enrollmentRepository.saveEnrollment( enrollmentDto );
        if( !savedEnrollment ) throw CustomError.internalServer('No se pudo guardar la inscripción.');
        return savedEnrollment;
    }


}