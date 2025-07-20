import 'dotenv/config';
import { get } from 'env-var';

export const envs = {
   
    PORT: get('PORT').required().asPortNumber(),
    DB_CON: get('DB_CON').asString(),
    SECRET_JWT_SEED: get('SECRET_JWT_SEED').asString(),

}