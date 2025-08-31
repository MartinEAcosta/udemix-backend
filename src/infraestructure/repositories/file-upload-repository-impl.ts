import { FileUploadDatasource } from "../../domain/datasources/file-upload.datasource";
import { UploadFileDto } from "../../domain/dtos/file-upload/file-upload.dto";
import { FileResponseDto } from "../../domain/dtos/file-upload/file-upload.response.dto";
import { FileUploadRepository } from "../../domain/repository/file-upload-repository";

export class FileUploadRepositoryImpl implements FileUploadRepository {

    constructor(private readonly fileUploadDatasource: FileUploadDatasource) {}

    uploadFile = async( file: UploadFileDto , folder : string ) : Promise<FileResponseDto | false> => {
        try {
            const fileUploaded = await this.fileUploadDatasource.uploadFile( file , folder );
            if( !fileUploaded ) return false;
            const uploadedFileinDB = await this.fileUploadDatasource.saveFileOnDB( fileUploaded );
            if( !uploadedFileinDB) return false;

            return uploadedFileinDB;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    deleteFile = async( folder : string , public_id : string ) : Promise<boolean> => {
        try{
            const res = await this.fileUploadDatasource.deleteFile( folder , public_id );
            return res;
        }
        catch( error ){
            console.log(error);
            return false;
        }
    }


}