
export interface CourseResponseDto {
    id: string,
    title : string,
    description : string,
    category : string ,
    thumbnail_url : string,
    id_owner : string,
    price : number,
    capacity ?: number | null,
}

