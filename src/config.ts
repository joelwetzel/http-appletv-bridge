import * as dotenv from 'dotenv';

class Config {
    // Public read only properties
    public readonly port: number;
    public readonly address: string;

    public readonly appletv_name: string;
    public readonly appletv_ip: string;
    public readonly appletv_credentials: string;

    public readonly webhook_on: string;
    public readonly webhook_off: string;

    constructor(path: string) {
        dotenv.config({ path: __dirname + '/config.env' });
        this.port = +(process.env.HOST_PORT ?? 8080);
        this.address = process.env.HOST_ADDRESS ?? 'localhost';

        this.appletv_name = process.env.APPLETV_NAME ?? 'Apple TV';
        this.appletv_ip = process.env.APPLETV_IP ?? 'localhost';
        this.appletv_credentials = process.env.APPLETV_CREDENTIALS ?? '';

        this.webhook_on = process.env.WEBHOOK_ON ?? '';
        this.webhook_off = process.env.WEBHOOK_OFF ?? '';
    }
}

export default Config;