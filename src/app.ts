import { envs } from './config/envs';
import { MongoDatabase } from './data';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

(async() => {
    main();
})();

async function main () {
    
    await connectWithRetry();

    const server = new Server({
        port: envs.PORT,
        routes: AppRoutes.routes,
    });

    server.start();

}

async function connectWithRetry(retries = 5, delayMs = 2000) {
    for (let i = 1; i <= retries; i++) {
        try {
            await MongoDatabase.connect({
                dbUrl: envs.DB_CON!,
                dbName: envs.DB_NAME!,
            });
            console.log('Conectado a MongoDB');
            return;
        } catch (error) {
            console.log(`Intento ${i}/${retries} fallido, reintentando en ${delayMs}ms...`);
            if (i === retries) throw error;
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
    }
}