import { CreateEnrollmentRequestDTO } from "../../domain/dtos/enrollment/create-enrollment.dto";
import { EnrollmentEntity } from "../../domain/entities/enrollment.entity";
import { EnrollmentRepository } from "../../domain/repository/enrollment-repository";
import { EnrollmentDatasource } from '../../domain/datasources/enrollment-datasource';
import { EnrollmentDetailedResponseDTO, UpdateEnrollmentRequestDTO } from "../../domain/dtos/enrollment/enrollment.response.dto";
import { TransactionSession } from "../../domain/services/UnitOfWork";


export class EnrollmentRepositoryImpl implements EnrollmentRepository {

    constructor (
        private readonly enrollmentDatasource : EnrollmentDatasource
    ){ }

    async findAllEnrollments( ) : Promise<EnrollmentEntity[]> {
        try{

            const enrollments = await this.enrollmentDatasource.findAllEnrollments();

            return enrollments.map( enrollment => EnrollmentEntity.fromObject( enrollment ));
        }
        catch( error ){
            throw error;
        }
    }

    async findEnrollmentById( id_enrollment : string ) : Promise<EnrollmentEntity | null>  {
        try{

            const enrollment = await this.enrollmentDatasource.findEnrollmentById( id_enrollment );
            if( !enrollment ) return null;

            return EnrollmentEntity.fromObject( enrollment );
        }
        catch( error ){
            throw error;
        }
    }

    async findEnrollmentPopulatedById( id_enrollment : string) : Promise<EnrollmentDetailedResponseDTO | null> {
        try{
            const enrollment = await this.enrollmentDatasource.findEnrollmentPopulatedById( id_enrollment );

            return enrollment ? enrollment : null;
        }
        catch( error ){
            throw error;
        }
    }


    async findEnrollmentsByUserId( uid : string ) : Promise<EnrollmentDetailedResponseDTO[]> {
        try{

            const enrollments = await this.enrollmentDatasource.findEnrollmentsByUserId( uid );
            if( !enrollments ) return [];

            return enrollments;
        }
        catch( error ){
            throw error;
        }
    }

    async saveEnrollment( enrollmentRequestDTO : CreateEnrollmentRequestDTO , ts ?: TransactionSession ) : Promise<EnrollmentEntity> {
        try{

            const savedEnrollment = await this.enrollmentDatasource.saveEnrollment( enrollmentRequestDTO , ts );

            return EnrollmentEntity.fromObject( savedEnrollment );
        }
        catch( error ){
            throw error;
        }
    }

    async updateEnrollment( enrollment: UpdateEnrollmentRequestDTO ): Promise<EnrollmentEntity> {
        try{

            const updatedEnrollment = await this.enrollmentDatasource.updateEnrollment( enrollment );

            return EnrollmentEntity.fromObject( updatedEnrollment );
        }
        catch( error ){
            throw error;
        }
    }

    async findEnrollmentByUserIdAndCourseId ( id_user : string, id_course : string): Promise<EnrollmentEntity | null> {
        try{

            const enrollment = await this.enrollmentDatasource.findEnrollmentByUserIdAndCourseId( id_user , id_course );
            if ( !enrollment ) return null;

            return EnrollmentEntity.fromObject( enrollment );
        }
        catch( error ){
            throw error;
        }
    }

}
