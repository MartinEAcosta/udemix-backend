import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
   
    PORT: get('PORT').required().asPortNumber(),
    DB_CON: get('DB_CON').required().asString(),
    SECRET_JWT_SEED: get('SECRET_JWT_SEED').required().asString(),
 
    CLOUDINARY_CLOUD_NAME: get('CLOUDINARY_CLOUD_NAME').required().asString(),
    CLOUDINARY_API_KEY: get('CLOUDINARY_API_KEY').required().asString(),
    CLODUINARY_API_SECRET: get('CLOUDINARY_API_SECRET').required().asString(),

    MAILER_SERVICE: get('MAILER_SERVICE').required().asString(),
    MAILER_EMAIL: get('MAILER_EMAIL').required().asString(),
    MAILER_SECRET_KEY: get('MAILER_SECRET_KEY').required().asString(),

    WEBSERVICE_URL: get('WEBSERVICE_URL').required().asString(),

    MERCADOPAGO_ACCESS_TOKEN: get('MERCADOPAGO_ACCESS_TOKEN').required().asString(),
    MERCADOPAGO_PUBLIC_KEY: get('MERCADOPAGO_PUBLIC_KEY').required().asString(),
}
