import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { DefaultLogger, LogLevel, VENDURE_VERSION, VendureLogger } from '@vendure/core';

export const otelLogger = logs.getLogger('@vendure/core', VENDURE_VERSION);

export interface OtelLoggerOptions {
    logToConsole?: LogLevel;
}

export class OtelLogger implements VendureLogger {
    private defaultLogger?: DefaultLogger;

    constructor(options: OtelLoggerOptions) {
        if (options.logToConsole) {
            this.defaultLogger = new DefaultLogger({
                level: options.logToConsole,
                timestamp: false,
            });
        }
    }

    debug(message: string, context?: string): void {
        this.emitLog(SeverityNumber.DEBUG, message, context);
        this.defaultLogger?.debug(message, context);
    }

    warn(message: string, context?: string): void {
        this.emitLog(SeverityNumber.WARN, message, context);
        this.defaultLogger?.warn(message, context);
    }

    info(message: string, context?: string): void {
        this.emitLog(SeverityNumber.INFO, message, context);
        this.defaultLogger?.info(message, context);
    }

    error(message: string, context?: string): void {
        this.emitLog(SeverityNumber.ERROR, message, context);
        this.defaultLogger?.error(message, context);
    }

    verbose(message: string, context?: string): void {
        this.emitLog(SeverityNumber.DEBUG, message, context);
        this.defaultLogger?.verbose(message, context);
    }

    private emitLog(severityNumber: SeverityNumber, message: string, context?: string, label?: string): void {
        otelLogger.emit({
            severityNumber,
            body: message,
            attributes: {
                context,
                service_name: 'vendure',
                ...(label ? { label } : {}),
            },
        });
    }
}
