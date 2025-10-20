import { UploadFileDto } from "../dtos/file-upload/file-upload.dto";
import { FileResponseDto } from "../dtos/file-upload/file-upload.response.dto";
import { TransactionSession } from "../services/UnitOfWork";

export abstract class FileRepository {

    abstract uploadFile ( file : UploadFileDto , folder : string , ts ?: TransactionSession ) : Promise<FileResponseDto | false>;
    abstract deleteFile ( id : string ) : Promise<boolean>;
    abstract findFileById ( id : string ) : Promise<FileResponseDto | null>;

}