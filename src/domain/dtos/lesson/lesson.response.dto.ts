
export interface LessonResponseDto {
    id            : string,
    id_course     : string,
    title         : string,
    description   : string,
    id_file       ?: string,
    unit          ?: number,
    chapter       ?: number,
    lesson_number : number,
    uploaded_at   : Date,
}

export interface LessonResponsePopulateDto {
    id            : string,
    id_course     : string,
    title         : string,
    description   : string,
    file          : FilePopulatedDto,
    unit          ?: number,
    chapter       ?: number,
    lesson_number : number,
    uploaded_at   : Date,
}

export interface FilePopulatedDto{
    _id   : string,
    url   : string,
}