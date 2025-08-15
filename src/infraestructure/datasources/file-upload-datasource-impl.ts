import { FileStorage } from "../../domain/services/FileStorage";
import { FileUploadDatasource } from "../../domain/datasources/file-upload.datasource";
import { CustomError } from "../../domain/errors/custom-error";
import { FileModel, IFileModel } from "../../data/mongo/models/file.model";
import { FileDto } from "../../domain/dtos/file-upload/file.dto";


export class FileUploadDatasourceImpl implements FileUploadDatasource {

    constructor( private readonly fileStorage : FileStorage ) {}

    uploadFile = async( file : FileDto , folder : string ) : Promise<IFileModel | undefined> => {
        try{
            const fileUploaded = await this.fileStorage.uploadFile( file , folder );
            return fileUploaded ? fileUploaded : undefined;
        }
        catch(error){
            console.error(error);
            throw CustomError.internalServer(`${error}`);
        }
    }

    saveFileOnDB = async ( file : IFileModel ) : Promise<IFileModel> => {
        try{
            
            const fileSaved = await FileModel.create( {
                filename      : file.filename,
                public_id     : file.public_id,
                size          : file.size,
                extension     : file.extension,
                resource_type : file?.resource_type,
            });
            fileSaved.id = fileSaved._id;
            return fileSaved;
        }
        catch(error){
            console.error(error);
            throw CustomError.internalServer(`${error}`);
        }
    }

}