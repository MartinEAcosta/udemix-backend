import { ResourceValidTypes } from "./file.dto";

export interface FileStorageAdapterResponseDto {
    id              ?: string;
    public_id        : string;
    url             ?: string;
    folder           : string;
    size             : number;
    extension        : string;
    resource_type    : ResourceValidTypes;
    duration        ?: number;
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

