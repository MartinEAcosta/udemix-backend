import { Types } from 'mongoose';
import { FileStorage } from "../../domain/services/FileStorage";
import { FileUploadDatasource } from "../../domain/datasources/file-upload.datasource";
import { CustomError } from "../../domain/errors/custom-error";
import { FileModel, FileStorageAdapterResponse, IFileModel } from "../../data/mongo/models/file.model";
import { UploadFileDto } from "../../domain/dtos/file-upload/upload-file.dto";
import { FileMapper } from '../mappers/file.mapper';


export class FileUploadDatasourceImpl implements FileUploadDatasource {

    constructor( private readonly fileStorage : FileStorage ) {}

    uploadFile = async( file : UploadFileDto , folder : string ) : Promise<FileStorageAdapterResponse | undefined> => {
        try{
            const fileUploaded = await this.fileStorage.uploadFile( file , folder );
            if( !fileUploaded ) throw CustomError.internalServer( 'Hubo un error al subir el archivo.');

            return fileUploaded ? fileUploaded : undefined;
        }
        catch(error){
            console.error(error);
            throw CustomError.internalServer(`${error}`);
        }
    }

    saveFileOnDB = async ( file : FileStorageAdapterResponse ) : Promise<IFileModel> => {
        try{
            
            const fileSaved = await FileModel.create( {
                id_course     : new Types.ObjectId(file.id_course),
                title         : file.lesson_title,
                unit          : file.unit,
                chapter       : file.chapter,
                public_id     : file.public_id,
                size          : file.size,
                extension     : file.extension,
                resource_type : file?.resource_type,
            });

            return FileMapper.fromIFileModel( fileSaved );
        }
        catch(error){
            console.error(error);
            throw CustomError.internalServer(`${error}`);
        }
    }

}