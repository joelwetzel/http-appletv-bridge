import IServiceInstaller from './iServiceInstaller';
import MacServiceInstaller from './macServiceInstaller';
import LinuxServiceInstaller from './linuxServiceInstaller';

class ServiceInstaller implements IServiceInstaller {
    platformService: any;

    constructor() {
        console.log('Platform: ' + process.platform);

        switch (process.platform) {
            case 'darwin':
                this.platformService = new MacServiceInstaller();
                break;
            case 'linux':
                this.platformService = new LinuxServiceInstaller();
                break;
            default:
                console.error('Unsupported platform.');
                return;
        }
    }

    public install() {
        if (this.platformService) {
            this.platformService.install();
        }
    }

    public uninstall() {
        if (this.platformService) {
            this.platformService.uninstall();
        }
    }

    public start() {
        if (this.platformService) {
            this.platformService.start();
        }
    }

    public stop() {
        if (this.platformService) {
            this.platformService.stop();
        }
    }

}

export default ServiceInstaller;