import { FileEntity } from "../../entities/file.entity";
import { FileUploadRepository } from "../../repository/file-upload-repository";
import { CustomError } from "../../errors/custom-error";
import { FileResponse } from "../../dtos/auth/responses";

export interface UploadFileUseCase {
    execute( files : FileEntity , folder : string ) : Promise<FileResponse>;
}

export class UploadSingle implements UploadFileUseCase {

    constructor( private readonly fileUploadRepository : FileUploadRepository ) { }
    
    execute = async( file : FileEntity , folder : string ): Promise<FileResponse> =>  {
        
        const res = await this.fileUploadRepository.uploadFile( file , folder );
        if( !res ){
            throw CustomError.badRequest('Hubo un error al subir el archivo: ' + file.name);
        }

        return {
            ok: res ? true : false,
            data: {
                    name: file.name,
                    size: file.size,
                    type : file.type,
                    format : file.format,
            }
        };        
    }
    
}