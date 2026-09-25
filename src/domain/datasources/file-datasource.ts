import { ResourceValidTypes, UploadFileDto } from "../dtos/file/file.dto";
import { FileResponseDto, FileStorageAdapterResponseDto } from "../dtos/file/file-response.dto";
import { TransactionSession } from "../services/UnitOfWork";

export abstract class FileDatasource {

    abstract uploadFile( file : UploadFileDto , folder : string ) : Promise<FileStorageAdapterResponseDto>;
    abstract saveFileOnDB( file : FileStorageAdapterResponseDto , ts ?: TransactionSession ) : Promise<FileResponseDto>;
    abstract deleteFile( folder : string , public_id : string , resource_type : ResourceValidTypes ) : Promise<boolean>;
    abstract deleteFileFromDB( id : string ) : Promise<boolean>;
    abstract findFileById( id : string ) : Promise<FileResponseDto | null>;
    

}