import { CreateEnrollmentDto } from "../../domain/dtos/enrollment/create-enrollment.dto";
import { EnrollmentEntity } from "../../domain/entities/enrollment.entity";
import { EnrollmentRepository } from "../../domain/repository/enrollment-repository";
import { EnrollmentDatasource } from '../../domain/datasources/enrollment.datasource';
import { EnrollmentDetailedResponseDto } from "../../domain/dtos/enrollment/enrollment.response.dto";


export class EnrollmentRepositoryImpl implements EnrollmentRepository {

    constructor ( 
        private readonly enrollmentDatasource : EnrollmentDatasource 
    ){ }
    
    async findAllEnrollments( ) : Promise<EnrollmentEntity[]> {
        const enrollments = await this.enrollmentDatasource.findAllEnrollments();
        
        return enrollments.map( enrollment => EnrollmentEntity.fromObject( enrollment ));
    }

    async findEnrollmentsByUserId( uid : string ) : Promise<EnrollmentDetailedResponseDto[]> {
        const enrollments = await this.enrollmentDatasource.findEnrollmentsByUserId( uid );
        if( !enrollments ) return [];

        return enrollments;
    }
    
    async saveEnrollment( enrollmentDto : CreateEnrollmentDto ) : Promise<EnrollmentEntity> {
        const savedEnrollment = await this.enrollmentDatasource.saveEnrollment( enrollmentDto );

        return EnrollmentEntity.fromObject( savedEnrollment );
    }

    // Analizar quitar
    async findEnrollmentByUserIdAndCourseId (uid: string, courseId: string): Promise<EnrollmentEntity | null> {
        const enrollment = await this.enrollmentDatasource.findEnrollmentByUserIdAndCourseId( uid , courseId );
        if ( !enrollment ) return null;

        return EnrollmentEntity.fromObject( enrollment );
    }
    
}