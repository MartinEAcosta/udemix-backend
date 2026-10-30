import { CourseModel, EnrollmentModel } from "../../data";
import { EnrollmentDatasource } from "../../domain/datasources/enrollment-datasource";
import { CreateEnrollmentRequestDTO } from "../../domain/dtos/enrollment/create-enrollment.dto";
import { EnrollmentMapper } from "../mappers/enrollment.mapper";
import { EnrollmentDetailedResponseDTO, EnrollmentResponseDTO, UpdateEnrollmentRequestDTO } from '../../domain/dtos/enrollment/enrollment.response.dto';
import { IEnrollmentDetailedModel } from '../../data/mongo/models/enrollment.model';
import { CustomError } from "../../domain/errors/custom-error";
import { TransactionSession } from "../../domain/services/UnitOfWork";

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

    saveEnrollment = async( enrollmentRequestDTO : CreateEnrollmentRequestDTO , ts ?: TransactionSession ) : Promise<EnrollmentResponseDTO> => {
        const session = ts?.getSession();

        // Guard de cupo + incremento en una sola operación atómica: es la única defensa real contra
        // la carrera entre inscripciones concurrentes. El $or cubre los cursos de cupo ilimitado
        // (capacity null) y los creados antes de que el campo existiera (sin la clave).
        const course = await CourseModel.findOneAndUpdate(
            {
                _id : enrollmentRequestDTO.id_course,
                $or : [
                    { capacity : { $exists : false } },
                    { capacity : null },
                    { $expr : { $lt : [ { $ifNull : [ "$current_enrolled" , 0 ] } , "$capacity" ] } },
                ],
            },
            { $inc : { current_enrolled : 1 } },
            { new : true , session },
        );
        if( !course ) throw CustomError.badRequest('El curso no existe o ya no tiene cupos disponibles.');

        // Mongoose ignora las options si el documento no va en un array.
        const [ savedEnrollment ] = await EnrollmentModel.create( [ enrollmentRequestDTO ] , { session } );
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
