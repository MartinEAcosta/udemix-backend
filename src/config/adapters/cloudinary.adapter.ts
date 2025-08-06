import { v2 as cloudinary } from 'cloudinary';
import { envs } from "../envs";

import { FileStorage } from "../../domain/services/FileStorage";
import { FileEntity, ResourceValidTypes } from "../../domain/entities/file.entity";
import { IFileModel } from '../../data/mongo/models/file.model';

export class CloudinaryAdapter implements FileStorage {

    constructor() {
        cloudinary.config({
            cloud_name: envs.CLOUDINARY_CLOUD_NAME,
            api_key: envs.CLOUDINARY_API_KEY,
            api_secret: envs.CLODUINARY_API_SECRET,
        });    
    }

    uploadFile = ( file: FileEntity , folder : string ) : Promise<IFileModel> => {
        return new Promise((resolve , reject) => {
            cloudinary.uploader.upload_stream( { folder: folder , resource_type: file.type as ResourceValidTypes } ,(error , result ) => {
                console.log("Cloudinary upload result:", result);
                if (error) {
                    console.error("Error uploading to Cloudinary:", error);

                    return reject(error);
                }

                if (!result) {
                    const errorMsg = "No result returned from Cloudinary upload";
                    console.error(errorMsg);

                    return reject(new Error(errorMsg));
                }
                else{
                    const fileModel: IFileModel = {
                        filename: file.name,
                        size: result.bytes,
                        type: file.type, 
                        format: file.format as ResourceValidTypes,
                    };

                    return resolve(fileModel);
                }
            }).end(file.data);
        });
    }

}