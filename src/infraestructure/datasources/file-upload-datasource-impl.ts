import { Types } from 'mongoose';
import { FileStorage } from "../../domain/services/FileStorage";
import { CustomError } from "../../domain/errors/custom-error";
import { FileModel, IFileModel } from "../../data/mongo/models/file.model";
import { UploadFileDto } from "../../domain/dtos/file-upload/file-upload.dto";
import { FileMapper } from '../mappers/file.mapper';
import { FileUploadDatasource } from '../../domain/datasources/file-upload.datasource';
import { FileResponseDto, FileStorageAdapterResponseDto } from '../../domain/dtos/file-upload/file-upload.response.dto';


export class FileUploadDatasourceImpl implements FileUploadDatasource {

    constructor( private readonly fileStorage : FileStorage ) {}

    uploadFile = async( file : UploadFileDto , folder : string ) : Promise<FileStorageAdapterResponseDto> => {
        try{
            const fileUploaded : FileStorageAdapterResponseDto = await this.fileStorage.uploadFile( file , folder );
            if( !fileUploaded ) throw CustomError.internalServer( 'Hubo un error al subir el archivo.');

            return fileUploaded;
        }
        catch(error){
            console.error(error);
            throw CustomError.internalServer(`${error}`);
        }
    }

    saveFileOnDB = async ( file : FileStorageAdapterResponseDto ) : Promise<FileResponseDto> => {
        try{
            
            const fileSaved = await FileModel.create( {
                public_id     : file.public_id,
                size          : file.size,
                extension     : file.extension,
                resource_type : file?.resource_type,
            });
            if( !fileSaved ) throw CustomError.internalServer('Hubo un error al grabar el archivo en la base de datos.')
            
            file.id = fileSaved._id.toString();

            return FileMapper.fromFileResponse( file );
        }
        catch(error){
            console.error(error);
            throw CustomError.internalServer(`${error}`);
        }
    }

}