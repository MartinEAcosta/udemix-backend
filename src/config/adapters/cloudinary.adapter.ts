import { FileEntity, ResourceValidTypes } from "../../domain/entities/file.entity";
import { FileStorage } from "../../domain/services/FileStorage";
import { v2 as cloudinary } from 'cloudinary';
import { envs } from "../envs";

export class CloudinaryAdapter implements FileStorage {

    constructor() {
        cloudinary.config({
            cloud_name: envs.CLOUDINARY_CLOUD_NAME,
            api_key: envs.CLOUDINARY_API_KEY,
            api_secret: envs.CLODUINARY_API_SECRET,
        });    
    }

    // { resource_type :  file.type }
    uploadFile = ( file: FileEntity , folder : string ) : Promise<boolean> => {
        return new Promise((resolve , reject) => {
            cloudinary.uploader.upload_stream( { folder: folder , resource_type: file.type as ResourceValidTypes } ,(error , result ) => {
                console.log("Cloudinary upload result:", result);
                if (error) {
                    console.error("Error uploading to Cloudinary:", error);
                    return reject(error);
                }
                return resolve( result ? true : false );
            }).end(file.data);
        });
    }

}