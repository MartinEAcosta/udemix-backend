import { FileStorage } from "../../domain/services/FileStorage";
import { CustomError } from "../../domain/errors/custom-error";
import { FileModel } from "../../data/mongo/models/file.model";
import { UploadFileDto } from "../../domain/dtos/file-upload/file-upload.dto";
import { FileMapper } from '../mappers/file.mapper';
import { FileUploadDatasource } from '../../domain/datasources/file-upload.datasource';
import { FileResponseDto, FileStorageAdapterResponseDto } from '../../domain/dtos/file-upload/file-upload.response.dto';
import { TransactionSession } from "../../domain/services/UnitOfWork";


export class FileUploadDatasourceImpl implements FileUploadDatasource {

    constructor( private readonly fileStorage : FileStorage ) {}

    uploadFile = async( file : UploadFileDto , folder : string , ts ?: TransactionSession ) : Promise<FileStorageAdapterResponseDto> => {
        const fileUploaded : FileStorageAdapterResponseDto = await this.fileStorage.uploadFile( file , folder , ts );
        if( !fileUploaded ) throw CustomError.internalServer( 'Hubo un error al subir el archivo.');

        return fileUploaded;
    }

    saveFileOnDB = async ( file : FileStorageAdapterResponseDto , ts ?: TransactionSession ) : Promise<FileResponseDto> => {
        console.log(file);
        const session = ts?.getSession();
        const fileSaved = await FileModel.create( [{
            public_id     : file.public_id,
            url           : file.url,
            folder        : file.folder,
            size          : file.size,
            extension     : file.extension,
            resource_type : file?.resource_type,
        }], { session });
        if( !fileSaved ) throw CustomError.internalServer('Hubo un error al grabar el archivo en la base de datos.')
        
        file.id = fileSaved[0]._id.toString();

        return FileMapper.fromFileResponseDto( fileSaved[0] );
    }

    deleteFile = async( folder : string ,public_id: string) : Promise<boolean> => {
        const fileDeleted = await this.fileStorage.deleteFile( folder, public_id );
        if( !fileDeleted ) return false;
                
        return true;
    }

    deleteFileFromDB = async( id : string ) : Promise<boolean> => {
        const fileDeleted = await FileModel.deleteOne( { _id : id } );
        if( fileDeleted.deletedCount === 0 ) return false;

        return true;
    }

    findFileById = async( id : string ) : Promise<FileResponseDto | null> =>{
        const file = await FileModel.findById( {_id: id} );
        if(!file ) return null;
        
        return FileMapper.fromFileResponseDto( file );
    }
}