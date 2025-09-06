import { FileUploadRepository } from "../../repository/file-upload-repository";

import { CustomError } from "../../errors/custom-error";
import { FileEntity } from "../../entities/file.entity";

interface FindFileByIdUseCase {
    execute ( id : string ) : Promise<FileEntity | null>;
}

export class FindFileById implements FindFileByIdUseCase{

    constructor ( 
        private readonly fileUploadRepository : FileUploadRepository 
    ) { }

    async execute ( id : string ) : Promise<FileEntity | null> {
        const fileResponse = await this.fileUploadRepository.findFileById( id ); 
        if( !fileResponse ) throw CustomError.notFound('No se encontró el archivo.');

        return fileResponse;
    }
}
