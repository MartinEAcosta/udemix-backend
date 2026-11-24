
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
    // Copia desnormalizada del url del File apuntado por id_file. Se persiste en el documento
    // de usuario, pero sólo la escribe AuthDatasource.updateUserAvatar — nunca llega desde un body.
    avatar_url      : string | null,
}

export interface AuthResponseDto {
    id       ?:   string,
    first_name : string,
    last_name : string,
    role    : string,
    isEmailVerified : boolean,
    email    : string,
    id_file    ?: string | null,
    // Presente en toda lectura de usuario (login, reload-token, find-user-by-id, update-profile).
    // Se lee directo del documento: ya no se deriva poblando id_file.
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