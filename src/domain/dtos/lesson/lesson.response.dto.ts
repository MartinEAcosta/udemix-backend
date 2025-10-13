
export interface LessonResponseDto {
    id            : string,
    id_course     : string,
    id_file      ?: string,
    id_module     : string,
    title         : string,
    description   : string,
    // unit         ?: number,
    // chapter      ?: number,
    lesson_number : number,
    uploaded_at   : Date,
}

export interface LessonResponsePopulateDto {
    id            : string,
    id_course     : string,
    file          : FilePopulatedDto,
    id_module     : string,
    title         : string,
    description   : string,
    // unit          ?: number,
    // chapter       ?: number,
    lesson_number : number,
    uploaded_at   : Date,
}

export interface FilePopulatedDto{
    _id   : string,
    url   : string,
}