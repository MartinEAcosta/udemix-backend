import { FileUploadRepository } from "../../repository/file-upload-repository";
import { FileEntity } from "../../entities/file.entity";
import { CustomError } from "../../errors/custom-error";

export interface UploadFileUseCase {
    execute( files : FileEntity , folder : string ) : Promise<boolean>;
}

export class UploadSingle implements UploadFileUseCase {

    constructor( private readonly fileUploadRepository : FileUploadRepository ) { }
    
    execute = async( file : FileEntity , folder : string ): Promise<boolean> =>  {
        
        const res = await this.fileUploadRepository.uploadFile( file , folder );
        if( !res ){
            throw CustomError.badRequest('Hubo un error al subir el archivo: ' + file.name);
        }
        return res;        
    }
    
}