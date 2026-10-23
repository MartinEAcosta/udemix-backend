import { EnrollmentModel } from "../../data";
import { EnrollmentDatasource } from "../../domain/datasources/enrollment-datasource";
import { CreateEnrollmentRequestDTO } from "../../domain/dtos/enrollment/create-enrollment.dto";
import { EnrollmentMapper } from "../mappers/enrollment.mapper";
import { EnrollmentDetailedResponseDTO, EnrollmentResponseDTO, UpdateEnrollmentRequestDTO } from '../../domain/dtos/enrollment/enrollment.response.dto';
import { IEnrollmentDetailedModel } from '../../data/mongo/models/enrollment.model';

export class EnrollmentDatasourceImpl extends EnrollmentDatasource {

    findAllEnrollments = async( ) : Promise<EnrollmentResponseDTO[]> => {
        const listOfAllEnrollments = await EnrollmentModel.find({});

        return listOfAllEnrollments.map( enrollment => EnrollmentMapper.fromEnrollmentResponseDTO( enrollment ) );
    }

    findEnrollmentById = async( id_enrollment : string ) : Promise<EnrollmentResponseDTO | null> => {
        const enrollment = await EnrollmentModel.findById({ _id : id_enrollment });
        if( !enrollment ) return null;

        return EnrollmentMapper.fromEnrollmentResponseDTO( enrollment );
    }

    findEnrollmentPopulatedById = async( id_enrollment : string ) : Promise<EnrollmentDetailedResponseDTO | null> => {
        const enrollment = await EnrollmentModel.findById({ _id : id_enrollment })
                                                    .populate<IEnrollmentDetailedModel>('id_course');

        return enrollment ? EnrollmentMapper.fromEnrollmentDetailedResponseDTO( enrollment ) : null;
    }

    findEnrollmentsByUserId = async( uid: string ) : Promise<EnrollmentDetailedResponseDTO[] | undefined>  =>{
        const listOfEnrollments = await EnrollmentModel.find({ id_user: uid })
                                                        .populate<IEnrollmentDetailedModel>( 'id_course' );
        if( !listOfEnrollments ) return;

        return listOfEnrollments.map( enrollment => EnrollmentMapper.fromEnrollmentDetailedResponseDTO( enrollment ) );
    }

    saveEnrollment = async(enrollmentRequestDTO: CreateEnrollmentRequestDTO) : Promise<EnrollmentResponseDTO> => {
        const savedEnrollment = await EnrollmentModel.create( enrollmentRequestDTO );
        if( !savedEnrollment ) throw 'Hubo un error al registrar la inscripción.';

        return EnrollmentMapper.fromEnrollmentResponseDTO( savedEnrollment );
    }

    updateEnrollment = async( enrollmentRequestDTO : UpdateEnrollmentRequestDTO ) : Promise<EnrollmentResponseDTO> => {
        const updatedEnrollment = await EnrollmentModel.findByIdAndUpdate( enrollmentRequestDTO.id , enrollmentRequestDTO , { new : true } );
        if( !updatedEnrollment ) throw 'Hubo un error al actualizar la inscripción.';

        return EnrollmentMapper.fromEnrollmentResponseDTO( updatedEnrollment );
    }

    findEnrollmentByUserIdAndCourseId = async( uid : string, courseId : string ) : Promise<EnrollmentResponseDTO | null> => {
        const enrollment = await EnrollmentModel.findOne({ id_user: uid, id_course: courseId });
        if( !enrollment ) return null;

        return EnrollmentMapper.fromEnrollmentResponseDTO( enrollment );
    }
}
