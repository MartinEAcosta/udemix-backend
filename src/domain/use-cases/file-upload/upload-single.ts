import { FileUploadRepository } from "../../repository/file-upload-repository";
import { FileEntity } from "../../entities/file.entity";

export interface UploadFileUseCase {
    execute( files : FileEntity , folder : string ) : Promise<boolean>;
}

export class UploadSingle implements UploadFileUseCase {

    constructor( private readonly fileUploadRepository : FileUploadRepository ) { }
    
    execute( file : FileEntity , folder : string ): Promise<boolean> {
        
        const res = this.fileUploadRepository.uploadFile( file , folder );

        return res;        
    }
    
}