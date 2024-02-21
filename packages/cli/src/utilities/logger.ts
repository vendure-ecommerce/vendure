import pc from 'picocolors';

export class Logger {
    static logLevel: 'silent' | 'info' | 'verbose' = 'info';

    static setLogLevel(level: 'silent' | 'info' | 'verbose') {
        this.logLevel = level;
    }

    static info(message: string) {
        if (this.logLevel === 'info' || this.logLevel === 'verbose') {
            // eslint-disable-next-line no-console
            console.log(pc.blue(message));
        }
    }

    static verbose(message: string) {
        if (this.logLevel === 'verbose') {
            // eslint-disable-next-line no-console
            console.log(pc.cyan(message));
        }
    }
}
