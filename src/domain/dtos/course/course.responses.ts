
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
export interface CourseOwnerResponseDto {
    id         : string,
    first_name : string,
    last_name  : string,
    avatar_url : string | null,
}

export interface CoursePopulateOwnerResponseDto extends Omit<CourseResponseDto , 'id_owner'> {
    owner : CourseOwnerResponseDto | null,
}

