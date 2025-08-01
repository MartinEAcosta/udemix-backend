import { CreateEnrollmentDto } from "../../domain/dtos/enrollment/create-enrollment.dto";
import { EnrollmentEntity } from "../../domain/entities/enrollment.entity";
import { EnrollmentRepository } from "../../domain/repository/enrollment.repository";
import { EnrollmentDatasource } from '../../domain/datasources/enrollment.datasource';


export class EnrollmentRepositoryImpl implements EnrollmentRepository {

    constructor ( private readonly enrollmentDatasource : EnrollmentDatasource ){}
    
    saveEnrollment = async( enrollmentDto : CreateEnrollmentDto ) : Promise<EnrollmentEntity> => {
        const savedEnrollment = await this.enrollmentDatasource.saveEnrollment( enrollmentDto );

        return EnrollmentEntity.fromObject( savedEnrollment );
    }

    getEnrollmentByUserIdAndCourseId = async(uid: string, courseId: string): Promise<EnrollmentEntity | null> => {
        const enrollment = await this.enrollmentDatasource.getEnrollmentByUserIdAndCourseId( uid , courseId );
        if ( !enrollment ) return null;

        return EnrollmentEntity.fromObject( enrollment );
    }
    
    getAllEnrollmentsByUserId = (uid: string): Promise<EnrollmentEntity> => {
        throw new Error("Method not implemented.");
    }
    
}