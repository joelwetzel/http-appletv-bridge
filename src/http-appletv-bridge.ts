#!/usr/bin/env node

import * as express from 'express';
import * as morgan from 'morgan';
import * as dotenv from 'dotenv';

import pyatv, { NodePyATVDevice, NodePyATVDeviceEvent, NodePyATVPowerState } from '@sebbo2002/node-pyatv';

import Test from './test';
import Server from './server';

let isConnected = false;
let powerState = false;

let atv: NodePyATVDevice;

function startServer() {
    console.log('Starting server...');

    var t = new Test();
    console.log(t.gen());

    // Specify the port and IP address for the server to listen on
    dotenv.config({ path: __dirname + '/config.env' });
    const port = +(process.env.HOST_PORT ?? 8080);
    const address = process.env.HOST_ADDRESS ?? 'localhost';

    const appletv_name = process.env.APPLETV_NAME ?? 'Apple TV';
    const appletv_ip = process.env.APPLETV_IP ?? 'localhost';
    const appletv_credentials = process.env.APPLETV_CREDENTIALS ?? '';

    const webhook_on = process.env.WEBHOOK_ON ?? '';
    const webhook_off = process.env.WEBHOOK_OFF ?? '';

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

    app.get('/on', async (req, res) => {
        powerState = true;

        // Turn on the apple tv, but errors should only be logged, not stop execution\
        try {
            if (isConnected) {
                await atv.turnOn();
            }
        } catch (error) {
            console.error(error);
        }

        // Make an HTTP GET request to the webhook_on URL
        // Ignore any errors
        require('http').get(webhook_on, () => { });

        res.send(String(powerState));
    });

    app.get('/off', async (req, res) => {
        powerState = false;

        // Turn off the apple tv, but errors should only be logged, not stop execution\
        try {
            if (isConnected) {
                await atv.turnOff();
            }
        } catch (error) {
            console.error(error);
        }

        // Make an HTTP GET request to the webhook_off URL
        // Ignore any errors
        require('http').get(webhook_off, () => { });

        res.send(String(powerState));
    });

    try {
        atv = pyatv.device({
            name: appletv_name,
            host: appletv_ip,
            airplayCredentials: appletv_credentials,
            companionCredentials: appletv_credentials,
        });

        atv.on('update:powerState', (event: NodePyATVDeviceEvent | Error) => {
            if (event instanceof Error) {
                return;
            }
            powerState = event.newValue === NodePyATVPowerState.on;

            console.log('update:powerState - ' + String(powerState));
        });

        isConnected = true;
    } catch (error) {
        console.error(error);
    }

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
