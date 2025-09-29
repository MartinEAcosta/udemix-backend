import { FileUploadRepository } from "../../domain/repository/file-upload-repository";
import { FileUploadDatasource } from "../../domain/datasources/file-upload.datasource";
import { UploadFileDto } from "../../domain/dtos/file-upload/file-upload.dto";
import { FileResponseDto } from "../../domain/dtos/file-upload/file-upload.response.dto";
import { FileMapper } from "../mappers/file.mapper";
import { FileEntity } from "../../domain/entities/file.entity";

export class FileUploadRepositoryImpl implements FileUploadRepository {

    constructor(
        private readonly fileUploadDatasource: FileUploadDatasource
    ) { }
    
    async uploadFile( file : UploadFileDto , folder : string ) : Promise<FileResponseDto | false>  {
        try {
            const fileUploaded = await this.fileUploadDatasource.uploadFile( file , folder );
            if( !fileUploaded ) return false;
            
            const uploadedFileinDB = await this.fileUploadDatasource.saveFileOnDB( fileUploaded );
            if( !uploadedFileinDB) return false;
            
            return FileMapper.fromFileResponseDto( uploadedFileinDB );
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
    async deleteFile( id : string ) : Promise<boolean> {
        try{
            const file = await this.fileUploadDatasource.findFileById( id );
            if( !file ) return false;

            const { folder , public_id } = file;
            const hasDeletedFromAdapter = await this.fileUploadDatasource.deleteFile( folder , public_id );
            if( !hasDeletedFromAdapter ) return false;
            
            const hasDeletedFromDB = await this.fileUploadDatasource.deleteFileFromDB( id );


            return (hasDeletedFromAdapter && hasDeletedFromDB);
        }
        catch( error ){
            console.log(error);
            throw error;
        }
    }

    async findFileById( id : string ) : Promise<FileEntity | null> {
        try{
            const file = await this.fileUploadDatasource.findFileById( id );
            if( !file ) return null;

            return FileEntity.fromObject( file );
        }
        catch( error ) {
            console.log(error);
            throw error;
        }
    }

}