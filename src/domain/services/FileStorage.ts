import { UploadFileDto } from "../dtos/file-upload/file-upload.dto";
import { FileStorageAdapterResponseDto } from "../dtos/file-upload/file-upload.response.dto";


export abstract class FileStorage {

    abstract uploadFile( file : UploadFileDto, folder : string ) : Promise<FileStorageAdapterResponseDto>;
    abstract deleteFile( folder : string, public_id : string ) : Promise<boolean>;

}