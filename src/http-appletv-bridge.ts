import * as express from 'express';
import * as morgan from 'morgan';
import * as dotenv from 'dotenv';

let powerState = false;

// Specify the port and IP address for the server to listen on
dotenv.config({ path: __dirname + '/config.env' });
const port = +(process.env.HOST_PORT ?? 8080);
const address = process.env.HOST_ADDRESS ?? 'localhost';

// Create a new Express application instance
const app = express();

// Logging
app.use(morgan('tiny'));

app.get('/ping', (req, res) => {
    res.send('Hello.');
});

app.get('/switch', (req, res) => {
    res.send(String(powerState));
});

app.get('/on', (req, res) => {
    powerState = true;
    res.send('OK');
});

app.get('/off', (req, res) => {
    powerState = false;
    res.send('OK');
});

app.listen(port, address, () => {
    console.log(`Server running at http://${address}:${port}`);
});
