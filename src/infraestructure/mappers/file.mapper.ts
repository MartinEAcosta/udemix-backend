import { FileResponseDto } from "../../domain/dtos/file-upload/file-upload.response.dto";

export class FileMapper {

    static fromFileResponse ( fileDoc : any ) : FileResponseDto {
        return {
            id: fileDoc._id,
            id_course: fileDoc.id_course,
            title: fileDoc.title,
            unit: fileDoc.unit,
            chapter: fileDoc.chapter,
            public_id: fileDoc.public_id,
            size: fileDoc.size,
            extension: fileDoc.extension,
            resource_type: fileDoc.resource_type,
            
        };
   }
}