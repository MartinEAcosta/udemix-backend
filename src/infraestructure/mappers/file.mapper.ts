import { FileResponseDto } from "../../domain/dtos/file-upload/file-upload.response.dto";

export class FileMapper {

    static fromFileResponse ( fileDoc : any ) : FileResponseDto {
        return {
            id: fileDoc._id,
            public_id: fileDoc.public_id,
            folder: fileDoc.folder,
            url: fileDoc.url,
            size: fileDoc.size,
            extension: fileDoc.extension,
            resource_type: fileDoc.resource_type,
        };
   }
}