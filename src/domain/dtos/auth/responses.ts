import { FileEntity } from "../../entities/file.entity";

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

export interface FileResponseData {
    file : FileEntity | FileEntity[];
}

export interface FileResponse {
    ok?: boolean;
    data: FileResponseData;
}