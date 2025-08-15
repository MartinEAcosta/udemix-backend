import { IFileModel } from "../../data/mongo/models/file.model";
import { FileDto } from "../dtos/file-upload/file.dto";


export abstract class FileUploadDatasource {

    abstract uploadFile( file : FileDto , folder : string ) : Promise<IFileModel | undefined>;
    abstract saveFileOnDB( file : IFileModel ) : Promise<IFileModel>;

}