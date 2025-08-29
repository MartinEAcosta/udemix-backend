import { FileUploadRepository } from '../../repository/file-upload-repository';

interface DeleteFileUseCase {
    execute ( public_id : string ) : Promise<boolean>
}

export class DeleteFile implements DeleteFileUseCase {

    constructor(
        private readonly fileUploadRepository : FileUploadRepository
    ) { }

    async execute( public_id: string ): Promise<boolean> {
        const res = this.fileUploadRepository.deleteFile( public_id );
        return res;
    }
    
}