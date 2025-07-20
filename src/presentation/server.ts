import express, { Router } from 'express';

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

        // Directorio publico
        this.app.use( express.static( 'public' ) );
        
        // Routes
        this.app.use( this.routes );

        this.app.listen( this.port , () => {
            console.log(`Servidor corriendo en puerto ${ this.port }`);
        })
    }

}