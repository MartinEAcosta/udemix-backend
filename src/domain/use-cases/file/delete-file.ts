import { FileRepository } from '../../repository/file-repository';

interface DeleteFileUseCase {
    execute ( id : string) : Promise<boolean>;
}

export class DeleteFile implements DeleteFileUseCase {

    constructor(
        private readonly fileRepository : FileRepository,
    ) { }

    async execute( id : string ): Promise<boolean> {
        const res = this.fileRepository.deleteFile( id );
        return res;
    }
    
}