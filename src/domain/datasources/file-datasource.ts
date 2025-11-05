import { UploadFileDto } from "../dtos/file-upload/file-upload.dto";
import { FileResponseDto, FileStorageAdapterResponseDto } from "../dtos/file-upload/file-upload.response.dto";
import { TransactionSession } from "../services/UnitOfWork";

export abstract class FileDatasource {

    abstract uploadFile( file : UploadFileDto , folder : string ) : Promise<FileStorageAdapterResponseDto>;
    abstract saveFileOnDB( file : FileStorageAdapterResponseDto , ts ?: TransactionSession ) : Promise<FileResponseDto>;
    abstract deleteFile( folder : string , public_id : string ) : Promise<boolean>;
    abstract deleteFileFromDB( id : string ) : Promise<boolean>;
    abstract findFileById( id : string ) : Promise<FileResponseDto | null>;
    

}