
export interface CourseResponseDto {
    id: string,
    title : string,
    description : string,
    id_category ?: string | null,
    category_name ?: string | null,
    thumbnail_url ?: string | null,
    id_file  ?: string | null,
    id_owner : string,
    price : number,
    capacity ?: number | null,
    current_enrolled : number,
    spots_remaining : number | null,
}

export interface CoursePopulateOwnerResponseDto {
    id: string,
    title : string,
    description : string,
    id_category ?: string | null,
    category_name ?: string | null,
    thumbnail_url ?: string | null,
    id_file  ?: string | null,
    owner : {
        id : string,
        username : string,
        email : string,
        avatar_url : string | null,
    },
    price : number,
    capacity ?: number | null,
    current_enrolled : number,
    spots_remaining : number | null,
}


