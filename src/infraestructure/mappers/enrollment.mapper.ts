import { IEnrollmentModel } from "../../data";
import { EnrollmentResponseDto } from "../../domain/dtos/enrollment/enrollment.response.dto";

export class EnrollmentMapper {

    static fromEnrollmentDto = ( enrollmentDoc : any ) : EnrollmentResponseDto => {
        return {
            id : enrollmentDoc._id,
            id_user : enrollmentDoc.id_user,
            id_course : enrollmentDoc.id_course,
            purchaseDate : enrollmentDoc.purchaseDate,
            progress : enrollmentDoc.progress,
            completionDate : enrollmentDoc.completionDate,
        }
    }
}