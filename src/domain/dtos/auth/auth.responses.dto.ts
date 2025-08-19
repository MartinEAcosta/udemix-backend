
export interface UserResponseDto {
    // id       :   string,
    username : string,
    email    : string,
}

export interface AuthSuccessResponseDto {
    user  : UserResponseDto,
    token : string,
}