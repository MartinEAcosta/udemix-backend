import { FileStorageAdapterResponse, IFileModel } from "../../data/mongo/models/file.model";
import { UploadFileDto } from "../dtos/file-upload/upload-file.dto";


export abstract class FileUploadDatasource {

    abstract uploadFile( file : UploadFileDto , folder : string ) : Promise<FileStorageAdapterResponse | undefined>;
    abstract saveFileOnDB( file : FileStorageAdapterResponse ) : Promise<IFileModel>;

}