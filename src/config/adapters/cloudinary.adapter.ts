import { v2 as cloudinary } from 'cloudinary';
import { envs } from "../envs";

import { FileStorage } from "../../domain/services/FileStorage";
import { FileStorageAdapterResponse, IFileModel } from '../../data/mongo/models/file.model';
import { UploadFileDto, ResourceValidTypes } from '../../domain/dtos/file-upload/upload-file.dto';

export class CloudinaryAdapter implements FileStorage {

    constructor() {
        cloudinary.config({
            cloud_name: envs.CLOUDINARY_CLOUD_NAME,
            api_key: envs.CLOUDINARY_API_KEY,
            api_secret: envs.CLODUINARY_API_SECRET,
        });    
    }

    uploadFile = ( file: UploadFileDto , folder : string ) : Promise<FileStorageAdapterResponse> => {
        return new Promise((resolve , reject) => {
            cloudinary.uploader.upload_stream( { 
                                                folder: folder ,
                                                resource_type: file.type! as ResourceValidTypes,
                                                width: 355,
                                                height: 240,
                                                crop: 'fill',
                                            } ,(error , result ) => {
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
                    const fileResponse : FileStorageAdapterResponse = {
                        id_course     : file.id_course,
                        lesson_title  : file.lesson_title,
                        unit      : file.unit,
                        chapter   : file.chapter,
                        public_id : result.public_id,
                        url       : result.secure_url,
                        size: result.bytes,
                        extension: result.format,
                        resource_type: result.resource_type,
                    };

                    return resolve(fileResponse);
                }
            }).end(file.data);
        });
    }

}