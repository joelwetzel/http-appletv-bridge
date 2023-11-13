#!/usr/bin/env node

import * as express from 'express';
import * as morgan from 'morgan';
import * as dotenv from 'dotenv';

let powerState = false;

function startServer() {
    console.log('Starting server...');

    // Specify the port and IP address for the server to listen on
    dotenv.config({ path: __dirname + '/config.env' });
    const port = +(process.env.HOST_PORT ?? 8080);
    const address = process.env.HOST_ADDRESS ?? 'localhost';

    // Create a new Express application instance
    const app = express();

    // Logging
    app.use(morgan('tiny'));

    app.get('/ping', (req, res) => {
        res.send('Hello world!');
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
}

function defineMacOSService() {
    var Service = require('node-mac').Service;

    var service = new Service({
        name: 'http-appletv-bridge',
        description: 'HTTP server for Apple TV',
        script: __dirname + '/http-appletv-bridge.js',
        env: {
            name: 'HOME',
            value: process.env["USERPROFILE"]
        }
    });

    service.on('install', function () {
        console.log('Service installed.');
        service.start();
    });

    service.on('start', function () {
        console.log('Service started.');
    });

    service.on('uninstall', function () {
        console.log('Service uninstalled.');
    });

    service.on('stop', function () {
        console.log('Service stopped.');
    });

    service.on('error', function (error: any) {
        console.error('Service error: ' + error);
    });

    return service;
}

function installMac() {
    var service = defineMacOSService();

    if (service.exists) {
        console.log('Service already exists.');
        return;
    }

    service.install();
}

function uninstallMac() {
    var service = defineMacOSService();

    if (!service.exists) {
        console.log('Service does not exist.');
        return;
    }

    service.uninstall();
}

function startMac() {
    var service = defineMacOSService();

    if (!service.exists) {
        console.log('Service does not exist.');
        return;
    }

    service.start();
}

function stopMac() {
    var service = defineMacOSService();

    if (!service.exists) {
        console.log('Service does not exist.');
        return;
    }

    service.stop();
}

function installLinux() {
}

function uninstallLinux() {
}

function startLinux() {
}

function stopLinux() {
}

function install() {
    console.log('Platform: ' + process.platform);

    switch (process.platform) {
        case 'darwin':
            installMac();
            break;
        case 'linux':
            installLinux();
            break;
        default:
            console.error('Unsupported platform.');
            return;
    }
}

function uninstall() {
    console.log('Platform: ' + process.platform);

    switch (process.platform) {
        case 'darwin':
            uninstallMac();
            break;
        case 'linux':
            uninstallLinux();
            break;
        default:
            console.error('Unsupported platform.');
            return;
    }
}

function start() {
    console.log('Platform: ' + process.platform);

    switch (process.platform) {
        case 'darwin':
            startMac();
            break;
        case 'linux':
            startLinux();
            break;
        default:
            console.error('Unsupported platform.');
            return;
    }
}

function stop() {
    console.log('Platform: ' + process.platform);

    switch (process.platform) {
        case 'darwin':
            stopMac();
            break;
        case 'linux':
            stopLinux();
            break;
        default:
            console.error('Unsupported platform.');
            return;
    }
}

if (process.argv.length > 2) {
    switch (process.argv[2]) {
        case 'installService':
            install();
            break;
        case 'uninstallService':
            uninstall();
            break;
        case 'startService':
            start();
            break;
        case 'stopService':
            stop();
            break;
        default:
            console.error('Unknown command. Allowed commands: install, uninstall');
            break;
    }
} else {
    startServer();
}
