import { FileEntity } from "../../entities/file.entity";
import { ResourceValidTypes } from "../file-upload/upload-file.dto";

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

// export interface FileResponseData {
//     file : FileEntity | FileEntity[];
// }

export interface FileResponse {
    id            : string,
    id_course     : string,
    title         : string,
    unit          : number,
    chapter       : number,
    size          : number,
    extension     : string,
    resource_type : ResourceValidTypes,
    public_id     : string,
}