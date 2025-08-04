import { FileUploadDatasource } from "../../domain/datasources/file-upload.datasource";
import { FileEntity } from "../../domain/entities/file.entity";


export class FileUploadDatasourceImpl extends FileUploadDatasource {

    uploadFile( file : FileEntity ): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}