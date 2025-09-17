import { EnrollmentModel } from "../../data";
import { EnrollmentDatasource } from "../../domain/datasources/enrollment.datasource";
import { CreateEnrollmentDto } from "../../domain/dtos/enrollment/create-enrollment.dto";
import { CustomError } from "../../domain/errors/custom-error";
import { EnrollmentMapper } from "../mappers/enrollment.mapper";
import { EnrollmentResponseDto } from '../../domain/dtos/enrollment/enrollment.response.dto';

export class EnrollmentDatasourceImpl extends EnrollmentDatasource {

    findAllEnrollments= async( ) : Promise<EnrollmentResponseDto[]> => {
        const listOfAllEnrollments = await EnrollmentModel.find({});

        return listOfAllEnrollments.map( enrollment => EnrollmentMapper.fromEnrollmentDto( enrollment ) );
    }
    
    findEnrollmentsByUserId = async( uid: string ) : Promise<EnrollmentResponseDto[] | undefined>  =>{
        const listOfEnrollments = await EnrollmentModel.find({ id_user: uid }); 
        if( !listOfEnrollments ) return;

        return listOfEnrollments.map( EnrollmentMapper.fromEnrollmentDto );
    }

    saveEnrollment = async(enrollmentDto: CreateEnrollmentDto) : Promise<EnrollmentResponseDto> => {
        const savedEnrollment= await EnrollmentModel.create( enrollmentDto );
        if( !savedEnrollment ) throw 'Hubo un error al registrar el usuario.';
            
        return EnrollmentMapper.fromEnrollmentDto( savedEnrollment );
    }

    findEnrollmentByUserIdAndCourseId = async(uid: string, courseId: string): Promise<EnrollmentResponseDto | null> => {
        const enrollment = await EnrollmentModel.findOne({ id_user: uid, id_course: courseId });
        if( !enrollment ) return null;

        return EnrollmentMapper.fromEnrollmentDto( enrollment );
    }
}