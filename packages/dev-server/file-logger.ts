import { VendureLogger } from '@vendure/core';
import fs from 'fs';

// A simple custom logger which writes all logs to a file.
export class SimpleFileLogger implements VendureLogger {
    private logfile: fs.WriteStream;

    constructor(logfileLocation: string) {
        this.logfile = fs.createWriteStream(logfileLocation, { flags: 'w', encoding: 'utf8' });
    }

    error(message: string, context?: string) {
        this.logfile.write(`${new Date().toISOString()} ERROR: [${context}] ${message}\n`, 'utf8');
    }
    warn(message: string, context?: string) {
        this.logfile.write(`${new Date().toISOString()} WARN: [${context}] ${message}\n`, 'utf8');
    }
    info(message: string, context?: string) {
        this.logfile.write(`${new Date().toISOString()} INFO: [${context}] ${message}\n`, 'utf8');
    }
    verbose(message: string, context?: string) {
        this.logfile.write(`${new Date().toISOString()} VERBOSE: [${context}] ${message}\n`, 'utf8');
    }
    debug(message: string, context?: string) {
        this.logfile.write(`${new Date().toISOString()} DEBUG: [${context}] ${message}\n`, 'utf8');
    }
}
