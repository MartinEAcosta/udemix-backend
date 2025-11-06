import { FileRepository } from "../../domain/repository/file-repository";
import { FileDatasource } from "../../domain/datasources/file-datasource";
import { UploadFileDto } from "../../domain/dtos/file-upload/file-upload.dto";
import { FileResponseDto } from "../../domain/dtos/file-upload/file-upload.response.dto";
import { FileMapper } from "../mappers/file.mapper";
import { FileEntity } from "../../domain/entities/file.entity";
import { TransactionSession } from "../../domain/services/UnitOfWork";

export class FileRepositoryImpl implements FileRepository {

    constructor(
        private readonly fileDatasource: FileDatasource
    ) { }
    
    async uploadFile( file : UploadFileDto , folder : string , ts ?: TransactionSession ) : Promise<FileResponseDto | false>  {
        try {
            const fileUploaded = await this.fileDatasource.uploadFile( file , folder );
            if( !fileUploaded ) return false;
            
            const uploadedFileinDB = await this.fileDatasource.saveFileOnDB( fileUploaded , ts  );
            if( !uploadedFileinDB) return false;
            
            return FileMapper.fromFileResponseDto( uploadedFileinDB );
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
    async deleteFile( id : string ) : Promise<boolean> {
        try{
            const file = await this.fileDatasource.findFileById( id );
            if( !file ) return false;
            const { folder , public_id } = file;
            const hasDeletedFromAdapter = await this.fileDatasource.deleteFile( folder , public_id );
            if( !hasDeletedFromAdapter ) return false;
            
            const hasDeletedFromDB = await this.fileDatasource.deleteFileFromDB( id );

            return (hasDeletedFromAdapter && hasDeletedFromDB);
        }
        catch( error ){
            console.log(error);
            throw error;
        }
    }

    async findFileById( id : string ) : Promise<FileEntity | null> {
        try{
            const file = await this.fileDatasource.findFileById( id );
            if( !file ) return null;

            return FileEntity.fromObject( file );
        }
        catch( error ) {
            console.log(error);
            throw error;
        }
    }

}