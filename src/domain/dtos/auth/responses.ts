
export interface UserResponse {
    id : string;
    email : string;
    username : string; 
}

export interface LoginUserResponse {
    user : UserResponse,
    token : unknown,
}