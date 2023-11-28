#!/usr/bin/env node

import Config from './config';
import AtvWrapper from './atvWrapper';
import ExpressServerWrapper from './expressServerWrapper';
import ServiceInstaller from './service/serviceInstaller';

let serviceInstaller = new ServiceInstaller();

let config: Config;
let atvWrapper: AtvWrapper;
let server: ExpressServerWrapper;

function startServer() {
    config = new Config(__dirname + '/config.env');
    atvWrapper = new AtvWrapper(config);
    server = new ExpressServerWrapper(config, atvWrapper);
}

if (process.argv.length > 2) {
    switch (process.argv[2]) {
        case 'installService':
            serviceInstaller.install();
            break;
        case 'uninstallService':
            serviceInstaller.uninstall();
            break;
        case 'startService':
            serviceInstaller.start();
            break;
        case 'stopService':
            serviceInstaller.stop();
            break;
        default:
            console.error('Unknown command. Allowed commands: install, uninstall');
            break;
    }
} else {
    startServer();
}
