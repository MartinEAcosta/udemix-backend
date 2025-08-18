import { IEnrollmentModel } from "../../data";

export class EnrollmentMapper {

    static fromIEnrollmentModel = ( enrollmentDoc : any ) : IEnrollmentModel => {
        return {
            _id : enrollmentDoc.id,
            id_user : enrollmentDoc.id_user,
            id_course : enrollmentDoc.id_course,
            purchaseDate : enrollmentDoc.purchaseDate,
            progress : enrollmentDoc.progress,
            completionDate : enrollmentDoc.completionDate,
        }
    }
}