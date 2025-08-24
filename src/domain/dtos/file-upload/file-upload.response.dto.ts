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
    id               : string; // Podría venir de la DB
    id_course        : string;
    title            : string;
    unit             : number;
    chapter          : number;
    public_id        : string;
    size             : number;
    extension        : string;
    resource_type    : ResourceValidTypes;
}

