interface IServiceInstaller {
    install(): void;
    uninstall(): void;
    start(): void;
    stop(): void;
}

export default IServiceInstaller;