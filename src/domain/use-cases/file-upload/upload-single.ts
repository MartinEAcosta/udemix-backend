import { FileUploadRepository } from "../../repository/file-upload-repository";
import { CustomError } from "../../errors/custom-error";
import { FileResponse } from "../../dtos/auth/responses";
import { UploadFileDto } from "../../dtos/file-upload/upload-file.dto";

export interface UploadFileUseCase {
    execute( files : UploadFileDto , folder : string ) : Promise<FileResponse>;
}

export class UploadSingle implements UploadFileUseCase {

    constructor( private readonly fileUploadRepository : FileUploadRepository ) { }
    
    execute = async( file : UploadFileDto , folder : string ): Promise<FileResponse> =>  {
        
        const res = await this.fileUploadRepository.uploadFile( file , folder );
        if( !res ){
            throw CustomError.badRequest('Hubo un error al subir el archivo: ' + file );
        }

        return {
            ...res,
        };        
    }
    
}