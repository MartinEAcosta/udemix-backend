
export interface UserResponseDto {
    id             ?:   string,
    first_name      : string,
    last_name       : string,
    email           : string,
    isEmailVerified : boolean,
    role            : string,
    password       ?: string | null,
    balance         : number,
    id_file        ?: string | null,
    // Derivado del File del usuario vía id_file poblado. Nunca se persiste en el documento de usuario.
    avatar_url      : string | null,
}

export interface UserRequestDto {
    id              ?: string,
    first_name      ?: string,
    last_name       ?: string,
    email           ?: string,
    isEmailVerified ?: boolean,
    role            ?: string,
    balance         ?: number,
    id_file         ?: string,
}

export interface AuthResponseDto {
    id       ?:   string,
    first_name : string,
    last_name : string,
    role    : string,
    isEmailVerified : boolean,
    email    : string,
    id_file    ?: string | null,
    // Populado en toda lectura de usuario (login, reload-token, find-user-by-id, update-profile),
    // derivado del File del usuario vía id_file. Nunca se persiste en el documento de usuario.
    avatar_url : string | null,
}
export interface AuthSuccessResponseDto {
    user  : AuthResponseDto,
    token : string,
}

export interface SocialLoginResponseDto {
    user  : AuthResponseDto,
    token : string,
    provider : string,
}