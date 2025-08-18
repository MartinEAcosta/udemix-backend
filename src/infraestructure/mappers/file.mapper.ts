import { Types } from "mongoose";
import { IFileModel } from "../../data/mongo/models/file.model";


export class FileMapper {


    static fromIFileModel ( fileDoc : any ) : IFileModel {
        return {
            _id: fileDoc._id,
            id_course: new Types.ObjectId(fileDoc.id_course),
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