import { FileEntity } from "../entities/file.entity";


export abstract class FileUploadRepository {

    abstract uploadFile ( file : FileEntity ) : Promise<boolean>;

}