
export interface CourseResponseDto {
    id: string,
    title : string,
    description : string,
    category : string ,
    thumbnail_url ?: string | null,
    thumbnail_id  ?: string | null,
    id_owner : string,
    price : number,
    capacity ?: number | null,
}

