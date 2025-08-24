import { FileUploadDatasource } from "../../domain/datasources/file-upload.datasource";
import { UploadFileDto } from "../../domain/dtos/file-upload/file-upload.dto";
import { FileEntity } from "../../domain/entities/file.entity";
import { FileUploadRepository } from "../../domain/repository/file-upload-repository";

export class FileUploadRepositoryImpl implements FileUploadRepository {

    constructor(private readonly fileUploadDatasource: FileUploadDatasource) {}

    uploadFile = async( file: UploadFileDto , folder : string ) : Promise<FileEntity | false> => {
        try {
            const fileUploaded = await this.fileUploadDatasource.uploadFile( file , folder );
            if( !fileUploaded ) return false;
            
            const uploadedFileinDB = await this.fileUploadDatasource.saveFileOnDB( fileUploaded );
            if( !uploadedFileinDB) return false;

            return FileEntity.fromObject( uploadedFileinDB );
        } catch (error) {
            console.log(error);
            return false;
        }
    }


}