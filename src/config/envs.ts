import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
   
    PORT: get('PORT').required().asPortNumber(),
    DB_CON: get('DB_CON').asString(),
    SECRET_JWT_SEED: get('SECRET_JWT_SEED').asString(),
 
    CLOUDINARY_CLOUD_NAME: get('CLOUDINARY_CLOUD_NAME').asString(),
    CLOUDINARY_API_KEY: get('CLOUDINARY_API_KEY').asString(),
    CLODUINARY_API_SECRET: get('CLOUDINARY_API_SECRET').asString(),
}