
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

/**
 * Curso con los datos del profesor resueltos por $lookup, para mostrar nombre y avatar
 * sin un segundo fetch. `owner` es null cuando el usuario referenciado ya no existe.
 * Conserva `id_owner` — el listado ya lo devolvía y quitarlo rompería a los consumidores.
 */
export interface CourseWithOwnerResponseDto extends CourseResponseDto {
    owner : CourseOwnerResponseDto | null,
}

