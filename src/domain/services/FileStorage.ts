import { UploadFileDto } from "../dtos/file-upload/file-upload.dto";
import { FileStorageAdapterResponseDto } from "../dtos/file-upload/file-upload.response.dto";
import { TransactionSession } from "./UnitOfWork";


export abstract class FileStorage {

    abstract uploadFile( file : UploadFileDto, folder : string , ts ?: TransactionSession ) : Promise<FileStorageAdapterResponseDto>;
    abstract deleteFile( folder : string, public_id : string ) : Promise<boolean>;

}