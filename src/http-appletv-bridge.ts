import * as express from 'express';
import * as morgan from 'morgan';

let powerState = false;

// Specify the port and IP address for the server to listen on
const port = 3000;
const address = '127.0.0.1';

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
