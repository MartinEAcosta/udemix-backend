
export interface UserResponseDto {
    id             ?:   string,
    username        : string,
    email           : string,
    isEmailVerified : boolean,
    role            : string,
    password       ?: string,
    balance         : number,
    avatar_url     ?: string | null,
    id_file        ?: string | null,
}

export interface UserRequestDto {
    id              ?: string,
    username        ?: string,
    email           ?: string,
    isEmailVerified ?: boolean,
    role            ?: string,
    balance         ?: number,
    avatar_url      ?: string,
    id_file         ?: string,
}

export interface AuthResponseDto {
    id       ?:   string,
    username : string,
    isEmailVerified : boolean,
    email    : string,
    avatar_url ?: string,
    id_file    ?: string,
}
export interface AuthSuccessResponseDto {
    user  : AuthResponseDto,
    token : string,
}