
export interface CourseResponseDto {
    id: string,
    title : string,
    description : string,
    id_category ?: string | null,
    thumbnail_url ?: string | null,
    id_file  ?: string | null,
    id_owner : string,
    price : number,
    capacity ?: number | null,
    current_enrolled : number,
}

