import express from 'express'

export class Servidor {
    
    constructor() {
        this.app = express();
        this.puerto = process.env.PORT ?? 3000
        this.URLInicio = '/'

        this.middlewares();

    }

    middlewares() {
        this.app.use(express.json());
        this.app.use(express.static('public'));
    }

    listen() {
        this.app.listen(this.puerto, () => {
            console.log(`El Servidor está corriendo en el puerto http://localhost:${this.puerto}`);
        })
    }

}