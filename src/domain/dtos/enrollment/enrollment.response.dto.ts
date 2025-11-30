export interface EnrollmentResponseDto {
    id : string;
    id_user : string;
    id_course : string;
    purchaseDate : Date;
    progress : number | null;
    completed_lessons : string[];
}

// export interface NextEnrollmentResponseDto {
//     id : string;
//     id_user : string;
//     id_course : string;
//     purchaseDate : Date;
//     progress : number | null;
//     completed_lessons : string[];
//     next_lesson : string;
// }

export interface UpdateEnrollmentDto {
    id : string;
    id_user : string;
    id_course : string;
    purchaseDate ?: Date;
    progress ?: number;
    completed_lessons ?: string[];
}

export interface EnrollmentDetailedResponseDto{
    id : string;
    id_user : string;
    course : CoursePopulatedDto,
    purchaseDate : Date;
    progress : number | null;
    completed_lessons : string[];
}

export interface CoursePopulatedDto{
    _id   : string,
    title : string,
    id_owner : string,
    thumbnail_url : string,
}