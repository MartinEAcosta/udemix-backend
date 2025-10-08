import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
   
    PORT: get('PORT').required().asPortNumber(),
    DB_CON: get('DB_CON').asString(),
    SECRET_JWT_SEED: get('SECRET_JWT_SEED').asString(),
 
    CLOUDINARY_CLOUD_NAME: get('CLOUDINARY_CLOUD_NAME').asString(),
    CLOUDINARY_API_KEY: get('CLOUDINARY_API_KEY').asString(),
    CLODUINARY_API_SECRET: get('CLOUDINARY_API_SECRET').asString(),

    MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
    MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
    MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),

    WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),
}