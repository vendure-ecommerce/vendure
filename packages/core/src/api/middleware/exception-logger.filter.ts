import { ArgumentsHost, ExceptionFilter, HttpException } from '@nestjs/common';

import { Logger, LogLevel } from '../../config';
import { I18nError } from '../../i18n/i18n-error';
import { parseContext } from '../common/parse-context';

/**
 * Logs thrown I18nErrors via the configured VendureLogger.
 */
export class ExceptionLoggerFilter implements ExceptionFilter {
    catch(exception: Error | HttpException | I18nError, host: ArgumentsHost) {
        const { req, res, info, isGraphQL } = parseContext(host);
        let message = '';
        let statusCode = 500;
        if (exception instanceof I18nError) {
            const { code, message: msg, logLevel } = exception;
            message = `${code || 'Error'}: ${msg}`;
            statusCode = this.errorCodeToStatusCode(code);

            switch (logLevel) {
                case LogLevel.Error:
                    Logger.error(message, undefined, exception.stack);
                    break;
                case LogLevel.Warn:
                    Logger.warn(message);
                    break;
                case LogLevel.Info:
                    Logger.info(message);
                    break;
                case LogLevel.Debug:
                    Logger.debug(message);
                    break;
                case LogLevel.Verbose:
                    Logger.verbose(message);
                    break;
            }
        } else if (exception instanceof HttpException) {
            // Handle other Nestjs errors
            statusCode = exception.getStatus();
            message = exception.message;
            let stack = exception.stack;
            if (statusCode === 404) {
                message = exception.message.message;
                stack = undefined;
            }
            Logger.error(message, undefined, stack);
        }

        if (!isGraphQL) {
            // In the GraphQL context, we can let the error pass
            // through to the next layer, where Apollo Server will
            // return a response for us. But when in the REST context,
            // we must explicitly send the response, otherwise the server
            // will hang.
            res.status(statusCode).json({
                statusCode,
                message,
                timestamp: new Date().toISOString(),
                path: req.url,
            });
        }
    }

    /**
     * For a given I18nError.code, returns a corresponding HTTP
     * status code.
     */
    private errorCodeToStatusCode(errorCode: string | undefined): number {
        switch (errorCode) {
            case 'FORBIDDEN':
                return 403;
            case 'UNAUTHORIZED':
                return 401;
            case 'USER_INPUT_ERROR':
            case 'ILLEGAL_OPERATION':
                return 400;
            default:
                return 500;
        }
    }
}
