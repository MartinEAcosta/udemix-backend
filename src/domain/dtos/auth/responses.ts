
export interface UserResponse {
    id : string;
    email : string;
    username : string; 
}

export interface AuthSuccessResponse {
    user : UserResponse,
    token : unknown,
}