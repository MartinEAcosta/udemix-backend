
export interface UserResponseDto {
    id             ?:   string,
    first_name      : string,
    last_name       : string,
    email           : string,
    isEmailVerified : boolean,
    role            : string,
    password       ?: string | null,
    balance         : number,
    avatar_url     ?: string | null,
    id_file        ?: string | null,
}

export interface UserRequestDto {
    id              ?: string,
    first_name      ?: string,
    last_name       ?: string,
    email           ?: string,
    isEmailVerified ?: boolean,
    role            ?: string,
    balance         ?: number,
    avatar_url      ?: string,
    id_file         ?: string,
}

export interface AuthResponseDto {
    id       ?:   string,
    first_name : string,
    last_name : string,
    role    : string,
    isEmailVerified : boolean,
    email    : string,
    avatar_url ?: string,
    id_file    ?: string,
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