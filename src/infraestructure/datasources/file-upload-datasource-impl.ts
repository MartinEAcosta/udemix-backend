import { FileUploadDatasource } from "../../domain/datasources/file-upload.datasource";
import { FileEntity } from "../../domain/entities/file.entity";
import { FileStorage } from "../../domain/services/FileStorage";


export class FileUploadDatasourceImpl implements FileUploadDatasource {

    constructor( private readonly fileStorage : FileStorage ) {}

    uploadFile( file : FileEntity , folder : string ): Promise<boolean> {
        return this.fileStorage.uploadFile( file , folder )
            .then( success => {
                return success;
            })
            .catch( error => {
                console.error("Error uploading file:", error);
                throw error;
            });
    }

}