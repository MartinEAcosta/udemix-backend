import { IFileModel } from "../../data/mongo/models/file.model";
import { FileEntity } from "../entities/file.entity";


export abstract class FileUploadDatasource {

    abstract uploadFile( file : FileEntity , folder : string ) : Promise<IFileModel | undefined>;

}