import { EnrollmentModel } from "../../data";
import { EnrollmentDatasource } from "../../domain/datasources/enrollment-datasource";
import { CreateEnrollmentDto } from "../../domain/dtos/enrollment/create-enrollment.dto";
import { EnrollmentMapper } from "../mappers/enrollment.mapper";
import { EnrollmentDetailedResponseDto, EnrollmentResponseDto, UpdateEnrollmentDto } from '../../domain/dtos/enrollment/enrollment.response.dto';
import { IEnrollmentDetailedModel } from '../../data/mongo/models/enrollment.model';

export class EnrollmentDatasourceImpl extends EnrollmentDatasource {

    findAllEnrollments = async( ) : Promise<EnrollmentResponseDto[]> => {
        const listOfAllEnrollments = await EnrollmentModel.find({});

        return listOfAllEnrollments.map( enrollment => EnrollmentMapper.fromEnrollmentDto( enrollment ) );
    }

    findEnrollmentById = async( id_enrollment : string ) : Promise<EnrollmentResponseDto | null> => {
        const enrollment = await EnrollmentModel.findById({ _id : id_enrollment });
        if( !enrollment ) return null;

        return EnrollmentMapper.fromEnrollmentDto( enrollment );
    }  
    
    findEnrollmentsByUserId = async( uid: string ) : Promise<EnrollmentDetailedResponseDto[] | undefined>  =>{
        const listOfEnrollments = await EnrollmentModel.find({ id_user: uid })
                                                        .populate<IEnrollmentDetailedModel>( 'id_course' ); 
        if( !listOfEnrollments ) return;

        return listOfEnrollments.map( enrollment => EnrollmentMapper.fromEnrollmentWithCourseDto( enrollment ) );
    }

    saveEnrollment = async(enrollmentDto: CreateEnrollmentDto) : Promise<EnrollmentResponseDto> => {
        const savedEnrollment = await EnrollmentModel.create( enrollmentDto );
        if( !savedEnrollment ) throw 'Hubo un error al registrar la inscripción.';
            
        return EnrollmentMapper.fromEnrollmentDto( savedEnrollment );
    }

    updateEnrollment = async( enrollmentDto : UpdateEnrollmentDto ) : Promise<EnrollmentResponseDto> => {
        const updatedEnrollment = await EnrollmentModel.findByIdAndUpdate( enrollmentDto.id , enrollmentDto , { new : true } );
        if( !updatedEnrollment ) throw 'Hubo un error al actualizar la inscripción.';

        return EnrollmentMapper.fromEnrollmentDto( updatedEnrollment );
    }

    findEnrollmentByUserIdAndCourseId = async( uid : string, courseId : string ) : Promise<EnrollmentResponseDto | null> => {
        const enrollment = await EnrollmentModel.findOne({ id_user: uid, id_course: courseId });
        if( !enrollment ) return null;

        return EnrollmentMapper.fromEnrollmentDto( enrollment );
    }
}