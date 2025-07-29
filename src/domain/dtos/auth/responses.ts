
export interface UserResponse {
    id : string;
    email : string;
    username : string; 
}

export interface AuthSuccessResponse {
    ok?: boolean,
    user : UserResponse,
    token : string,
}