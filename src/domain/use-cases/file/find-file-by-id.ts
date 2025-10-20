import { FileRepository } from "../../repository/file-repository";

import { CustomError } from "../../errors/custom-error";
import { FileEntity } from "../../entities/file.entity";

interface FindFileByIdUseCase {
    execute ( id : string ) : Promise<FileEntity | null>;
}

export class FindFileById implements FindFileByIdUseCase{

    constructor ( 
        private readonly fileRepository : FileRepository 
    ) { }

    async execute ( id : string ) : Promise<FileEntity | null> {
        const fileResponse = await this.fileRepository.findFileById( id ); 
        if( !fileResponse ) throw CustomError.notFound('No se encontró el archivo.');

        return fileResponse;
    }
}
