import * as express from 'express';
import * as morgan from 'morgan';

import Config from './config';
import AtvWrapper from './atvWrapper';

class Server {
    private app: express.Application;

    constructor(config: Config, atvWrapper: AtvWrapper) {
        console.log('Starting server...');

        // Create a new Express application instance
        this.app = express();
        // Logging
        this.app.use(morgan('tiny'));

        this.app.get('/ping', (req, res) => {
            res.send('Hello world!');
        });

        this.app.get('/switch', (req, res) => {
            res.send(String(atvWrapper.powerState));
        });

        this.app.get('/on', async (req, res) => {
            atvWrapper.turnOn();

            res.send(String(atvWrapper.powerState));
        });

        this.app.get('/off', async (req, res) => {
            atvWrapper.turnOff();

            res.send(String(atvWrapper.powerState));
        });

        this.app.listen(config.port, config.address, () => {
            console.log(`Server running at http://${config.address}:${config.port}`);
        });
    }

}

export default Server;