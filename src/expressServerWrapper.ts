import * as express from 'express';
import * as morgan from 'morgan';

import Config from './config';
import AtvWrapper from './atvWrapper';

class ExpressServerWrapper {
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
            await atvWrapper.turnOnAsync();

            res.send(String(atvWrapper.powerState));
        });

        this.app.get('/off', async (req, res) => {
            await atvWrapper.turnOffAsync();

            res.send(String(atvWrapper.powerState));
        });

        this.app.listen(config.port, config.address, () => {
            console.log(`Server running at http://${config.address}:${config.port}`);
        });
    }

}

export default ExpressServerWrapper;