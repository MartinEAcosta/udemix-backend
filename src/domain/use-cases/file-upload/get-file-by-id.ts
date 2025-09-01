import { FileUploadRepository } from "../../repository/file-upload-repository";

import { FileResponseDto } from '../../dtos/file-upload/file-upload.response.dto';

interface GetFileByIdUseCase {
    execute ( id : string ) : Promise<FileResponseDto>;
}

export class GetFileById implements GetFileByIdUseCase{

    constructor ( private readonly fileUploadRepository : FileUploadRepository ) {}

    execute = async(id: string): Promise<FileResponseDto> => {
        const fileResponse = this.fileUploadRepository.getFileById( id ); 

        return fileResponse;
    }
}
