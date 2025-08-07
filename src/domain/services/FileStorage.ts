import { IFileModel } from "../../data/mongo/models/file.model";
import { FileEntity } from "../dtos/file-upload/file.dto";


export abstract class FileStorage {

    abstract uploadFile( file : FileEntity , folder : string ) : Promise<IFileModel>;

}