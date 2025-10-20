import { FileRepository } from "../../repository/file-repository";
import { CustomError } from "../../errors/custom-error";
import { UploadFileDto } from "../../dtos/file-upload/file-upload.dto";
import { FileResponseDto } from "../../dtos/file-upload/file-upload.response.dto";

export interface UploadFileUseCase {
    execute( files : UploadFileDto , folder : string ) : Promise<FileResponseDto>;
}

export class UploadSingle implements UploadFileUseCase {

    constructor( private readonly fileRepository : FileRepository ) { }
    
    execute = async( file : UploadFileDto , folder : string ): Promise<FileResponseDto> =>  {
        const res = await this.fileRepository.uploadFile( file , folder );
        if( !res ){
            throw CustomError.badRequest('Hubo un error al subir el archivo: ' + file );
        }
        console.log(res);
        return {
            ...res,
        };        
    }
    
}