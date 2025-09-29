import { ResourceValidTypes } from "./file-upload.dto";

export interface FileStorageAdapterResponseDto {
    id              ?: string;
    public_id        : string;
    url             ?: string;
    folder           : string;
    size             : number;
    extension        : string;
    resource_type    : ResourceValidTypes;
}

export interface FileResponseDto {
    id           : string;
    public_id    : string;
    url          : string;
    folder       : string;
    size         : number;
    extension    : string;
    resource_type: ResourceValidTypes;
}

