import { ResourceValidTypes } from "./file-upload.dto";

export interface FileStorageAdapterResponseDto {
    id              ?: string;
    public_id        : string;
    url             ?: string,
    size             : number;
    extension        : string;
    resource_type    : ResourceValidTypes;
}

export interface FileResponseDto {
    id           : string;
    size         : number;
    url         ?: string | null;    
    extension:     string;
    resource_type: ResourceValidTypes;
    public_id:     string;
}

