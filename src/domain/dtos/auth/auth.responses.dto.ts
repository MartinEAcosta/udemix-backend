
export interface UserResponseDto {
    id       ?:   string,
    username : string,
    email    : string,
    balance   : number,
    enrolledCourses : string[];
}

export interface UserRequestDto {
    username : string,
    email    : string,
    balance   : number,
    enrolledCourses : string[],
}

export interface AuthSuccessResponseDto {
    user  : AuthResponseDto,
    token : string,
}
export interface AuthResponseDto {
    id       ?:   string,
    username : string,
    email    : string,
}