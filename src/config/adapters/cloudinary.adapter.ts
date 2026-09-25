import { v2 as cloudinary } from 'cloudinary';
import { envs } from "../envs";

import { FileStorage } from "../../domain/services/FileStorage";
import { UploadFileDto, ResourceValidTypes } from '../../domain/dtos/file/file.dto';
import { FileStorageAdapterResponseDto } from '../../domain/dtos/file/file-response.dto';
import { TransactionSession } from '../../domain/services/UnitOfWork';

export class CloudinaryAdapter implements FileStorage {

    constructor() {
        cloudinary.config({
            cloud_name: envs.CLOUDINARY_CLOUD_NAME,
            api_key: envs.CLOUDINARY_API_KEY,
            api_secret: envs.CLOUDINARY_API_SECRET,
        });    
    }

    uploadFile = ( file: UploadFileDto , folder : string  ) : Promise<FileStorageAdapterResponseDto> => {
        return new Promise((resolve , reject) => {
            const resource_type = file.type! as ResourceValidTypes;
            // El recorte solo aplica a imágenes (thumbnails/avatars), los videos se suben sin transformar.
            const transformation = resource_type === 'image'
                                        ? { width: 355, height: 240, crop: 'fill' }
                                        : {};

            cloudinary.uploader.upload_stream( { 
                                                folder: folder ,
                                                resource_type: resource_type,
                                                ...transformation,
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
                    // console.log(result);
                    const [ folderFromResult , public_id ] = result.public_id.split('/');
                    // console.log(folderFromResult , public_id);
                    const fileResponse : FileStorageAdapterResponseDto = {
                        url           : result.secure_url,
                        public_id     : public_id,
                        folder        : folderFromResult,
                        size          : result.bytes,
                        extension     : result.format,
                        resource_type : result.resource_type,
                        // Cloudinary solo devuelve duration para videos.
                        duration      : result.duration ? Math.round(result.duration) : undefined,
                    };

                    return resolve(fileResponse);
                }
            }).end(file.data);
        });
    }

    deleteFile = ( folder : string , public_id : string , resource_type : ResourceValidTypes ) : Promise<boolean> => {
        const pathFile = `${folder}/${public_id}`;
        return new Promise( ( resolve , reject ) => {
            // destroy() busca por defecto en 'image', los videos no se encuentran si no se indica el resource_type.
            cloudinary.uploader.destroy( pathFile , { resource_type } , ( error , result ) => {
                console.log( error , result)
                if( error ) return reject( error );

                if( result.result === 'not found' ) return resolve(false);
                
                return resolve(true);
            })
        })
    }

}