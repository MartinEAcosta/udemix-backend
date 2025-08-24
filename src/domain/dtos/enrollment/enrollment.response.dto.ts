

export interface EnrollmentResponseDto {
    id : string;
    id_user : string;
    id_course : string;
    purchaseDate : Date;
    progress : number | null;
    completionDate : Date;
}