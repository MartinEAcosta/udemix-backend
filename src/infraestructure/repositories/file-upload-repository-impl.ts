import { FileUploadDatasource } from "../../domain/datasources/file-upload.datasource";
import { FileEntity } from "../../domain/entities/file.entity";
import { FileUploadRepository } from "../../domain/repository/file-upload-repository";

export class FileUploadRepositoryImpl implements FileUploadRepository {

    constructor(private readonly fileUploadDatasource: FileUploadDatasource) {}

    uploadFile = async(file: FileEntity , folder : string): Promise< FileEntity | false> => {
        try {
            const fileUploaded = await this.fileUploadDatasource.uploadFile( file , folder );
            if( !fileUploaded ) return false;
            return FileEntity.fromObject( fileUploaded );
        } catch (error) {
            console.log(error);
            return false;
        }
    }


}