import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';

import { Logger, LogLevel } from '../../config';
import { I18nError } from '../../i18n/i18n-error';

/**
 * Logs thrown I18nErrors via the configured VendureLogger.
 */
export class ExceptionLoggerFilter implements ExceptionFilter {
    catch(exception: Error, host: ArgumentsHost) {
        if (exception instanceof I18nError) {
            const { code, message, logLevel } = exception;
            const logMessage = `BOBBY ${code || 'Error'}: ${message}`;
            switch (logLevel) {
                case LogLevel.Error:
                    Logger.error(logMessage, undefined, exception.stack);
                    break;
                case LogLevel.Warn:
                    Logger.warn(logMessage);
                    break;
                case LogLevel.Info:
                    Logger.info(logMessage);
                    break;
                case LogLevel.Debug:
                    Logger.debug(logMessage);
                    break;
                case LogLevel.Verbose:
                    Logger.verbose(logMessage);
                    break;
            }
        }
    }
}
