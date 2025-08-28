import { ResourceValidTypes } from "./file-upload.dto";

export interface FileStorageAdapterResponseDto {
    id_course        : string;
    lesson_title     : string;
    unit             : number;
    chapter          : number;
    public_id        : string;
    url              : string,
    size             : number;
    extension        : string;
    resource_type    : ResourceValidTypes;
}

export interface FileResponseDto {
    id           : string;
    id_course    : string;
    title       ?: string;
    unit        ?: number;
    chapter     ?: number;
    size:          number;
    extension:     string;
    resource_type: ResourceValidTypes;
    public_id:     string;

}

