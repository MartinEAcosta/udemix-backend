import { FileUploadDatasource } from "../../domain/datasources/file-upload.datasource";
import { FileEntity } from "../../domain/entities/file.entity";
import { CustomError } from "../../domain/errors/custom-error";
import { FileStorage } from "../../domain/services/FileStorage";


export class FileUploadDatasourceImpl implements FileUploadDatasource {

    constructor( private readonly fileStorage : FileStorage ) {}

    uploadFile = async( file : FileEntity , folder : string ): Promise<boolean> => {
        try{
            const hasSaved = await this.fileStorage.uploadFile( file , folder )
                                                               .then( success => {
                                                                    return success;
                                                               })
                                                               .catch( error => {
                                                                   console.error("Error uploading file:", error);
                                                                   throw error;
                                                               });

            return hasSaved;
        }
        catch(error){
            console.error(error);
            throw CustomError.internalServer(`${error}`);
        }
  
  
  
  
  
  
  
  
    }

}