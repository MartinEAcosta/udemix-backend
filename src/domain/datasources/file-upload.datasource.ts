import { ResourceValidTypes, UploadFileDto } from "../dtos/file-upload/upload-file.dto";

export interface FileResponse {
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
export interface FileStorageAdapterResponse {
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
export abstract class FileUploadDatasource {

    abstract uploadFile( file : UploadFileDto , folder : string ) : Promise<FileStorageAdapterResponse>;
    abstract saveFileOnDB( file : FileStorageAdapterResponse ) : Promise<FileResponse>;

}