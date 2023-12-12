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

        if (this.config.appletv_enable) {
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

                    this.notifyWebhook();

                    console.log('update:powerState - ' + String(this._powerState));
                });

                this._isConnected = true;
            }
            catch (error) {
                console.error(error);
            }
        }
    }

    async turnOnAsync() {
        // Turn on the apple tv, but errors should only be logged, not stop execution\
        try {
            if (this._isConnected && this.atv) {
                await this.atv.turnOn();
            }
        } catch (error) {
            console.error(error);
            return;
        }

        this._powerState = true;

        this.notifyWebhook();
    }

    async turnOffAsync() {
        // Turn off the apple tv, but errors should only be logged, not stop execution\
        try {
            if (this._isConnected && this.atv) {
                await this.atv.turnOff();
            }
        } catch (error) {
            console.error(error);
            return;
        }

        this._powerState = false;

        this.notifyWebhook();
    }

    notifyWebhook() {
        if (this._powerState) {
            // Make an HTTP GET request to the webhook_on URL
            // Ignore any errors
            if (this.config.webhook_on && this.config.webhook_on.length > 0) {
                require('http').get(this.config.webhook_on, () => { });
            }
        }
        else {
            // Make an HTTP GET request to the webhook_off URL
            // Ignore any errors
            if (this.config.webhook_off && this.config.webhook_off.length > 0) {
                require('http').get(this.config.webhook_off, () => { });
            }
        }
    }
}

export default AtvWrapper;