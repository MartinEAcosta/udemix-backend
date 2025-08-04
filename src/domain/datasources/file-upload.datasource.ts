import { FileEntity } from "../entities/file.entity";


export abstract class FileUploadDatasource {

    abstract uploadFile( file : FileEntity ) : Promise<boolean>;

}