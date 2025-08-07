import { FileUploadRepository } from "../../repository/file-upload-repository";
import { CustomError } from "../../errors/custom-error";
import { FileResponse } from "../../dtos/auth/responses";
import { FileDto } from "../../dtos/file-upload/file.dto";

export interface UploadFileUseCase {
    execute( files : FileDto , folder : string ) : Promise<FileResponse>;
}

export class UploadSingle implements UploadFileUseCase {

    constructor( private readonly fileUploadRepository : FileUploadRepository ) { }
    
    execute = async( file : FileDto , folder : string ): Promise<FileResponse> =>  {
        
        const res = await this.fileUploadRepository.uploadFile( file , folder );
        if( !res ){
            throw CustomError.badRequest('Hubo un error al subir el archivo: ' + file );
        }

        return {
            ok: res ? true : false,
            data: {
                file: res
            }
        };        
    }
    
}