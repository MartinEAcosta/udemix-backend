
export interface CourseResponseDto {
    id: string,
    title : string,
    description : string,
    category ?: string | null,
    thumbnail_url ?: string | null,
    file_id  ?: string | null,
    id_owner : string,
    price : number,
    capacity ?: number | null,
    current_enrolled : number,
}

