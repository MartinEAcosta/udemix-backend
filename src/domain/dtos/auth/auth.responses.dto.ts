
export interface UserResponseDto {
    id             ?:   string,
    username        : string,
    email           : string,
    isEmailVerified : boolean,
    role            : string,
    password       ?: string | null,
    balance         : number,
    id_file        ?: string | null,
}

export interface UserRequestDto {
    id              ?: string,
    username        ?: string,
    email           ?: string,
    isEmailVerified ?: boolean,
    role            ?: string,
    balance         ?: number,
    id_file         ?: string,
}

export interface AuthResponseDto {
    id       ?:   string,
    username : string,
    role    : string,
    isEmailVerified : boolean,
    email    : string,
    id_file    ?: string | null,
    // Populado únicamente en el login, derivado del File del usuario vía id_file.
    // Nunca se persiste en el documento de usuario.
    avatar_url ?: string | null,
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

/**
 * Shape devuelto únicamente por AuthDatasource.findUserByEmailForLogin / AuthRepository.findUserByEmailForLogin.
 * Extiende UserResponseDto (incluye password, para la comparación en LoginUser) y agrega el avatar_url
 * derivado del File poblado vía id_file. No representa el documento persistido — solo existe para el flujo de login.
 */
export interface UserLoginResponseDto extends UserResponseDto {
    avatar_url : string | null,
}