export interface EnrollmentResponseDTO {
    id : string;
    id_user : string;
    id_course : string;
    purchaseDate : Date;
    progress : number | null;
    last_lesson : string | null;
    last_accessed_at : Date | null;
    completed_lessons : string[];
    completed_at : Date | null;
}

// export interface NextEnrollmentResponseDTO {
//     id : string;
//     id_user : string;
//     id_course : string;
//     purchaseDate : Date;
//     progress : number | null;
//     completed_lessons : string[];
//     next_lesson : string;
// }

export interface UpdateEnrollmentRequestDTO {
    id : string;
    id_user : string;
    id_course : string;
    purchaseDate ?: Date;
    progress ?: number;
    completed_lessons ?: string[];
}

export interface EnrollmentDetailedResponseDTO{
    id : string;
    id_user : string;
    course : CoursePopulatedDTO,
    purchaseDate : Date;
    progress : number | null;
    completed_lessons : string[];
}

export interface CoursePopulatedDTO{
    _id   : string,
    title : string,
    id_owner : string,
    thumbnail_url : string,
}
