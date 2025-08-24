import { UploadFileDto } from "../dtos/file-upload/file-upload.dto";
import { FileResponseDto, FileStorageAdapterResponseDto } from "../dtos/file-upload/file-upload.response.dto";

export abstract class FileUploadDatasource {

    abstract uploadFile( file : UploadFileDto , folder : string ) : Promise<FileStorageAdapterResponseDto>;
    abstract saveFileOnDB( file : FileStorageAdapterResponseDto ) : Promise<FileResponseDto>;

}