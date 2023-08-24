// Import the built-in 'http' module
import * as http from 'http';

// Create an HTTP server that responds with "Hello World" to all requests
const server = http.createServer((req, res) => {
    console.log('Request received');
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World 2\n');
});

// Specify the port and IP address for the server to listen on
const port = 3000;
const address = '127.0.0.1';

// Start the server and listen on the specified port and address
server.listen(port, address, () => {
    console.log(`Server running at http://${address}:${port}/`);
});
