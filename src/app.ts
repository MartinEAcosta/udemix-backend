import { envs } from './config/envs';
import { MongoDatabase } from './data';
import { AppRoutes } from './presentation/routes';
import { Server } from './presentation/server';

(async() => {
    main();
})();

async function main () {
    
    await MongoDatabase.connect({
        dbUrl: envs.DB_CON!,
        dbName: undefined,
    })

    const server = new Server({
        port: envs.PORT,
        routes: AppRoutes.routes,
    });

    server.start();

}