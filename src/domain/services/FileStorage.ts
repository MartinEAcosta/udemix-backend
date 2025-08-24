import { FileStorageAdapterResponse } from "../../data/mongo/models/file.model";
import { UploadFileDto } from "../dtos/file-upload/file-upload.dto";


export abstract class FileStorage {

    abstract uploadFile( file : UploadFileDto, folder : string ) : Promise<FileStorageAdapterResponse>;

}