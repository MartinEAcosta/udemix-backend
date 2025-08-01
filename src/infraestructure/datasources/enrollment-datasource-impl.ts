import { EnrollmentModel, IEnrollmentModel } from "../../data";
import { EnrollmentDatasource } from "../../domain/datasources/enrollment.datasource";
import { CreateEnrollmentDto } from "../../domain/dtos/enrollment/create-enrollment.dto";
import { CustomError } from "../../domain/errors/custom-error";


export class EnrollmentDatasourceImpl extends EnrollmentDatasource {
    
    saveEnrollment = async(enrollmentDto: CreateEnrollmentDto) : Promise<IEnrollmentModel> => {
        try {
            
            const savedEnrollment= await EnrollmentModel.create( enrollmentDto );
            if( !savedEnrollment ) throw 'Hubo un error al registrar el usuario.';
                
            return savedEnrollment;
        } 
        catch (error) {
            console.log(error);
            throw CustomError.internalServer(`${error}`)
        }
    }

    getAllEnrollmentsByUserId = async( uid: string ) : Promise<IEnrollmentModel[] | undefined>  =>{
        try{
            const listOfEnrollments = await EnrollmentModel.find({ id_user: uid }); 
            if( !listOfEnrollments ) return;
            return listOfEnrollments;
        }
        catch(error){
            console.log(error);
            throw CustomError.internalServer(`${error}`)
        }
    }

    getEnrollmentByUserIdAndCourseId = async(uid: string, courseId: string): Promise<IEnrollmentModel | null> => {
        try{
            
            const enrollment = await EnrollmentModel.findOne({ id_user: uid, id_course: courseId });
            if( !enrollment ) return null;
            return enrollment;
        }
        catch(error){
            console.log(error);
            throw CustomError.internalServer(`${error}`)
        }
    }
}