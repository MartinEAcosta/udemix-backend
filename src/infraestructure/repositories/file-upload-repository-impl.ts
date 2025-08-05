import { FileUploadDatasource } from "../../domain/datasources/file-upload.datasource";
import { FileEntity } from "../../domain/entities/file.entity";
import { FileUploadRepository } from "../../domain/repository/file-upload-repository";

export class FileUploadRepositoryImpl implements FileUploadRepository {

    constructor(private readonly fileUploadDatasource: FileUploadDatasource) {}

    async uploadFile(file: FileEntity , folder : string): Promise<boolean> {
        try {
            await this.fileUploadDatasource.uploadFile( file , folder );
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }


}