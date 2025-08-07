import { FileUploadDatasource } from "../../domain/datasources/file-upload.datasource";
import { FileDto } from "../../domain/dtos/file-upload/file.dto";
import { FileEntity } from "../../domain/entities/file.entity";
import { FileUploadRepository } from "../../domain/repository/file-upload-repository";

export class FileUploadRepositoryImpl implements FileUploadRepository {

    constructor(private readonly fileUploadDatasource: FileUploadDatasource) {}

    uploadFile = async( file: FileDto , folder : string ) : Promise<FileEntity | false> => {
        try {
            const fileUploaded = await this.fileUploadDatasource.uploadFile( file , folder );
            if( !fileUploaded ) return false;
            
            const hasUploadedToDB = await this.fileUploadDatasource.saveFileOnDB( fileUploaded );
            if( !hasUploadedToDB ) return false;

            return FileEntity.fromObject( fileUploaded );
        } catch (error) {
            console.log(error);
            return false;
        }
    }


}