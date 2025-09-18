

export interface EnrollmentResponseDto {
    id : string;
    id_user : string;
    id_course : string;
    purchaseDate : Date;
    progress : number | null;
    completionDate : Date | null;
}

export interface EnrollmentDetailedResponseDto{
    id : string;
    id_user : string;
    course : CoursePopulatedDto,
    purchaseDate : Date;
    progress : number | null;
    completionDate : Date | null;
}

export interface CoursePopulatedDto{
    _id   : string,
    title : string,
    id_owner : string,
    thumbnail_url : string,
}