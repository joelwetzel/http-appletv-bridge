import pyatv, { NodePyATVDevice, NodePyATVDeviceEvent, NodePyATVPowerState } from '@sebbo2002/node-pyatv';
import Config from './config';

class AtvWrapper {
    private atv?: NodePyATVDevice;

    private config: Config;

    private _isConnected = false;

    private _powerState = false;

    get isConnected() {
        return this._isConnected;
    }

    get powerState() {
        return this._powerState;
    }

    constructor(config: Config) {
        this.config = config;

        try {
            this.atv = pyatv.device({
                name: config.appletv_name,
                host: config.appletv_ip,
                airplayCredentials: config.appletv_credentials,
                companionCredentials: config.appletv_credentials,

            });

            this.atv.on('error', (error: Error | NodePyATVDeviceEvent) => {
                console.error(error);
            });

            this.atv.on('update:powerState', (event: NodePyATVDeviceEvent | Error) => {
                if (event instanceof Error) {
                    return;
                }
                this._powerState = event.newValue === NodePyATVPowerState.on;

                console.log('update:powerState - ' + String(this._powerState));
            });
        }
        catch (error) {
            console.error(error);
        }

        this._isConnected = true;
    }

    async turnOn() {
        // Turn on the apple tv, but errors should only be logged, not stop execution\
        try {
            if (this._isConnected && this.atv) {
                await this.atv.turnOn();
            }
        } catch (error) {
            console.error(error);
        }

        this._powerState = true;

        // Make an HTTP GET request to the webhook_on URL
        // Ignore any errors
        require('http').get(this.config.webhook_on, () => { });
    }

    async turnOff() {
        // Turn off the apple tv, but errors should only be logged, not stop execution\
        try {
            if (this._isConnected && this.atv) {
                await this.atv.turnOff();
            }
        } catch (error) {
            console.error(error);
        }

        this._powerState = false;

        // Make an HTTP GET request to the webhook_on URL
        // Ignore any errors
        require('http').get(this.config.webhook_off, () => { });
    }
}

export default AtvWrapper;