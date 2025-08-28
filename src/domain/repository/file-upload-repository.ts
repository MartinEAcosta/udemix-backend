import { UploadFileDto } from "../dtos/file-upload/file-upload.dto";
import { FileEntity } from "../entities/file.entity";


export abstract class FileUploadRepository {

    abstract uploadFile ( file : UploadFileDto , folder : string ) : Promise<FileEntity | false>;

}