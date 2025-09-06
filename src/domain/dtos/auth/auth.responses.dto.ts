
export interface UserResponseDto {
    id             ?:   string,
    username        : string,
    email           : string,
    password       ?: string,
    balance         : number,
}

export interface UserRequestDto {
    id             ?: string,
    username        : string,
    email           : string,
    balance         : number,
}

export interface AuthResponseDto {
    id       ?:   string,
    username : string,
    email    : string,
}
export interface AuthSuccessResponseDto {
    user  : AuthResponseDto,
    token : string,
}