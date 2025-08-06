import { FileEntity, ResourceValidTypes } from './../../entities/file.entity';

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
    name: string;
    size: number;
    type: string;
    format: ResourceValidTypes;
}

export interface FileResponse {
    ok?: boolean;
    data: FileResponseData;
}