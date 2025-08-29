import { UploadFileDto } from "../dtos/file-upload/file-upload.dto";
import { FileResponseDto } from "../dtos/file-upload/file-upload.response.dto";

export abstract class FileUploadRepository {

    abstract uploadFile ( file : UploadFileDto , folder : string ) : Promise<FileResponseDto | false>;
    abstract deleteFile ( public_id : string ) : Promise<boolean>;

}