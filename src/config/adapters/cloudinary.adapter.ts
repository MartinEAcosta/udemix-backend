import { v2 as cloudinary } from 'cloudinary';
import { envs } from "../envs";

import { FileStorage } from "../../domain/services/FileStorage";
import { IFileModel } from '../../data/mongo/models/file.model';
import { FileDto, ResourceValidTypes } from '../../domain/dtos/file-upload/file.dto';

export class CloudinaryAdapter implements FileStorage {

    constructor() {
        cloudinary.config({
            cloud_name: envs.CLOUDINARY_CLOUD_NAME,
            api_key: envs.CLOUDINARY_API_KEY,
            api_secret: envs.CLODUINARY_API_SECRET,
        });    
    }

    uploadFile = ( file: FileDto , folder : string ) : Promise<IFileModel> => {
        return new Promise((resolve , reject) => {
            cloudinary.uploader.upload_stream( { folder: folder , resource_type: file.type! as ResourceValidTypes } ,(error , result ) => {
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
                    //TODO Arreglar nombrado:
                    console.log(result);
                    const fileModel : IFileModel = {
                        filename: file.filename,
                        public_id : result.secure_url,
                        size: result.bytes,
                        extension: result.format,
                        resource_type: result.resource_type,
                    };

                    return resolve(fileModel);
                }
            }).end(file.data);
        });
    }

}