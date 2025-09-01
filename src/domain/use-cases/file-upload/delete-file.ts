import { FileUploadRepository } from '../../repository/file-upload-repository';

interface DeleteFileUseCase {
    execute ( id : string) : Promise<boolean>;
}

export class DeleteFile implements DeleteFileUseCase {

    constructor(
        private readonly fileUploadRepository : FileUploadRepository
    ) { }

    async execute( id : string ): Promise<boolean> {
        const res = this.fileUploadRepository.deleteFile( id );
        return res;
    }
    
}