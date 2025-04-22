import { SeverityNumber } from '@opentelemetry/api-logs';

import { otelLogger } from '../../instrumentation';

import { VendureLogger } from './vendure-logger';

export class OtelLogger implements VendureLogger {
    debug(message: string, context?: string): void {
        this.emitLog(SeverityNumber.DEBUG, message, context);
    }

    warn(message: string, context?: string): void {
        this.emitLog(SeverityNumber.WARN, message, context);
    }

    info(message: string, context?: string): void {
        this.emitLog(SeverityNumber.INFO, message, context);
    }

    error(message: string, context?: string): void {
        this.emitLog(SeverityNumber.ERROR, message, context);
    }

    verbose(message: string, context?: string): void {
        this.emitLog(SeverityNumber.DEBUG, message, context);
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
