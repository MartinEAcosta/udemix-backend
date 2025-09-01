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
            throw error;
        }
    }
    
    deleteFile = async( id : string ) : Promise<boolean> => {
        try{
            const file = await this.fileUploadDatasource.getFileById( id );
            if( !file ) return false;

            const { folder , public_id } = file;
            const res = await this.fileUploadDatasource.deleteFile( folder , public_id );
            if( !res ) return false;
            
            await this.fileUploadDatasource.deleteFileFromDB( id );

            return res;
        }
        catch( error ){
            console.log(error);
            return false;
        }
    }

    getFileById = async(id: string) : Promise<FileResponseDto> => {
        try{
            return this.fileUploadDatasource.getFileById( id );
        }
        catch( error ) {
            console.log(error);
            throw error;
        }
    }

}