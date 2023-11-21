#!/usr/bin/env node

import Config from './config';
import AtvWrapper from './atvWrapper';
import Server from './server';

let config: Config;
let atvWrapper: AtvWrapper;
let server: Server;

function startServer() {
    config = new Config(__dirname + '/config.env');
    atvWrapper = new AtvWrapper(config);
    server = new Server(config, atvWrapper);
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
