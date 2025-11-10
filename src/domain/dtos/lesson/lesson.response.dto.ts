
export interface LessonResponseDto {
    id            : string,
    id_course     : string,
    id_file      ?: string,
    id_module     : string,
    title         : string,
    description   : string,
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
    lesson_number : number,
    uploaded_at   : Date,
}

export interface FilePopulatedDto{
    id   : string | null,
    url   : string | null,
}