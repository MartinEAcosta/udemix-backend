import { v2 as cloudinary } from 'cloudinary';
import { envs } from "../envs";

import { FileStorage } from "../../domain/services/FileStorage";
import { UploadFileDto, ResourceValidTypes } from '../../domain/dtos/file-upload/file-upload.dto';
import { FileStorageAdapterResponseDto } from '../../domain/dtos/file-upload/file-upload.response.dto';

export class CloudinaryAdapter implements FileStorage {

    constructor() {
        cloudinary.config({
            cloud_name: envs.CLOUDINARY_CLOUD_NAME,
            api_key: envs.CLOUDINARY_API_KEY,
            api_secret: envs.CLODUINARY_API_SECRET,
        });    
    }

    uploadFile = ( file: UploadFileDto , folder : string ) : Promise<FileStorageAdapterResponseDto> => {
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
                    const [ folderFromResult , public_id ] = result.public_id.split('/');
                    console.log(folderFromResult , public_id);
                    const fileResponse : FileStorageAdapterResponseDto = {
                        url           : result.secure_url,
                        public_id     : public_id,
                        folder        : folderFromResult,
                        size          : result.bytes,
                        extension     : result.format,
                        resource_type : result.resource_type,
                    };

                    return resolve(fileResponse);
                }
            }).end(file.data);
        });
    }

    deleteFile = ( folder : string , public_id : string ) : Promise<boolean> => {
        const pathFile = `${folder}/${public_id}`;
        return new Promise( ( resolve , reject ) => {
            cloudinary.uploader.destroy( pathFile , {} , ( error , result ) => {
                console.log( error , result)
                if( error ) return reject( error );

                if( result.result === 'not found' ) resolve(false);
                
                return resolve(true);
            })
        })
    }

}