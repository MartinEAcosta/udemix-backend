import express, { Router } from 'express';
import cors from 'cors';
import fileUpload from 'express-fileupload';

interface Options {
    port: number,
    routes: Router,
    public_path?: string,
}

export class Server {

    private app = express();
    private readonly port : number;
    private readonly routes : Router;
    private readonly publicPath : string;

    constructor ( options : Options ) {
        const { port , routes , public_path = 'public' } = options;
        this.port = port;
        this.routes = routes;
        this.publicPath = public_path;
    } 

    async start() {
        // Lectura y parseo del body
        this.app.use( express.json() );
        this.app.use( cors() );
        this.app.use(fileUpload({
            limits: { fileSize: 50 * 1024 * 1024 },
        }));

        // Directorio publico
        this.app.use( express.static( 'public' ) );
        
        // Routes
        this.app.use( this.routes );

        this.app.listen( this.port , () => {
            console.log(`Servidor corriendo en puerto ${ this.port }`);
        })
    }

}