import { IEnrollmentDetailedModel, IEnrollmentModel } from "../../data";
import { EnrollmentDetailedResponseDto, EnrollmentResponseDto } from "../../domain/dtos/enrollment/enrollment.response.dto";

export class EnrollmentMapper {

    static fromEnrollmentDto = ( enrollmentDoc : IEnrollmentModel ) : EnrollmentResponseDto => {
        return {
            id : enrollmentDoc._id.toString(),
            id_user : enrollmentDoc.id_user.toString(),
            id_course : enrollmentDoc.id_course.toString(),
            purchaseDate : enrollmentDoc.purchaseDate,
            progress : enrollmentDoc.progress ?? 0,
            completionDate : enrollmentDoc.completionDate ?? null,
        }
    }

    static fromEnrollmentWithCourseDto = ( enrollmentDoc : IEnrollmentDetailedModel ) : EnrollmentDetailedResponseDto => {
        return {
            id : enrollmentDoc._id.toString(),
            id_user : enrollmentDoc.id_user.toString(),
            course : {
                _id : enrollmentDoc.id_course._id.toString(),
                title : enrollmentDoc.id_course.title,
                id_owner : enrollmentDoc.id_course.id_owner.toString(),
                thumbnail_url : enrollmentDoc.id_course.thumbnail_url,
            },
            purchaseDate : enrollmentDoc.purchaseDate,
            progress : enrollmentDoc.progress ?? 0,
            completionDate : enrollmentDoc.completionDate ?? null,
        }
    }
}