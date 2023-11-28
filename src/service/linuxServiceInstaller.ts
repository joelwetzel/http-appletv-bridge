import IServiceInstaller from "./iServiceInstaller";

class LinuxServiceInstaller implements IServiceInstaller {
    service: any;

    constructor() {
        this.service = this.defineLinuxService();
    }

    public install() {
        if (this.service.exists()) {
            console.log('Service already exists.');
            return;
        }

        this.service.install();
    }

    public uninstall() {
        if (!this.service.exists()) {
            console.log('Service does not exist.');
            return;
        }

        this.service.uninstall();
    }

    public start() {
        if (!this.service.exists()) {
            console.log('Service does not exist.');
            return;
        }

        this.service.start();
    }

    public stop() {
        if (!this.service.exists()) {
            console.log('Service does not exist.');
            return;
        }

        this.service.stop();
    }


    defineLinuxService() {
        var Service = require('node-linux').Service;

        var service = new Service({
            name: 'http-appletv-bridge',
            description: 'HTTP server for Apple TV',
            script: __dirname + '/../http-appletv-bridge.js',
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

}

export default LinuxServiceInstaller;