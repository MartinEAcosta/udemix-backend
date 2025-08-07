import { FileDto } from "../dtos/file-upload/file.dto";
import { FileEntity } from "../entities/file.entity";


export abstract class FileUploadRepository {

    abstract uploadFile ( file : FileDto , folder : string ) : Promise<FileEntity | false>;

}