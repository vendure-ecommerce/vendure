import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';

import { Logger, LogLevel } from '../../config';
import { I18nError } from '../../i18n/i18n-error';
import { parseContext } from '../common/parse-context';

/**
 * Logs thrown I18nErrors via the configured VendureLogger.
 */
export class ExceptionLoggerFilter implements ExceptionFilter {
    catch(exception: Error | HttpException | I18nError, host: ArgumentsHost) {
        if (exception instanceof I18nError) {
            const { code, message, logLevel } = exception;
            const logMessage = `${code || 'Error'}: ${message}`;
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
        } else if (exception instanceof HttpException) {
            // Handle other Nestjs errors
            const { req, res, info } = parseContext(host);
            const status = exception.getStatus();
            let message = exception.message;
            let stack = exception.stack;
            if (status === 404) {
                message = exception.message.message;
                stack = undefined;
            }
            Logger.error(message, undefined, stack);

            res.status(status).json({
                statusCode: status,
                message,
                timestamp: new Date().toISOString(),
                path: req.url,
            });
        }
    }
}
