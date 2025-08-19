import { Types } from "mongoose";
import { FileResponse } from "../../domain/datasources/file-upload.datasource";


export class FileMapper {


    static fromFileResponse ( fileDoc : any ) : FileResponse {
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