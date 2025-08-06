import { FileStorage } from "../../domain/services/FileStorage";
import { FileUploadDatasource } from "../../domain/datasources/file-upload.datasource";
import { FileEntity } from "../../domain/entities/file.entity";
import { CustomError } from "../../domain/errors/custom-error";
import { FileModel, IFileModel } from "../../data/mongo/models/file.model";


export class FileUploadDatasourceImpl implements FileUploadDatasource {

    constructor( private readonly fileStorage : FileStorage ) {}

    uploadFile = async( file : FileEntity , folder : string ): Promise<IFileModel | undefined> => {
        try{
            const fileUploaded = await this.fileStorage.uploadFile( file , folder );
            if( fileUploaded ){
                //TODO : CREAR DTO
                // enviar DTO a saveFileOnDB
                await this.saveFileOnDB( fileUploaded );
            }
            return fileUploaded ? fileUploaded : undefined;
        }
        catch(error){
            console.error(error);
            throw CustomError.internalServer(`${error}`);
        }
    }

    saveFileOnDB = async ( file : IFileModel ) : Promise<void> => {
        try{
            // Grabar archivo en base de datos.
            console.log(file)
            const fileSaved = await FileModel.create( file );
            if( !fileSaved ) throw CustomError.internalServer('No se pudo guardar el archivo en la base de datos');
        }
        catch(error){
            console.error(error);
            throw CustomError.internalServer(`${error}`);
        }
    }

}