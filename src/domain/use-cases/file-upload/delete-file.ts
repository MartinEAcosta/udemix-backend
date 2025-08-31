import { FileUploadRepository } from '../../repository/file-upload-repository';

interface DeleteFileUseCase {
    execute ( folder : string , public_id : string ) : Promise<boolean>
}

export class DeleteFile implements DeleteFileUseCase {

    constructor(
        private readonly fileUploadRepository : FileUploadRepository
    ) { }

    async execute( folder : string , public_id: string ): Promise<boolean> {
        const res = this.fileUploadRepository.deleteFile( folder , public_id );
        return res;
    }
    
}