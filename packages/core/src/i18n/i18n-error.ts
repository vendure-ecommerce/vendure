import { ApolloError } from 'apollo-server-core';

import { Logger, LogLevel } from '../config/logger/vendure-logger';

/**
 * @description
 * All errors thrown in the Vendure server must use or extend this error class. This allows the
 * error message to be translated before being served to the client.
 *
 * The error messages should be provided in the form of a string key which corresponds to
 * a key defined in the `i18n/messages/<languageCode>.json` files.
 *
 * Note that this class should not be directly used in code, but should be extended by
 * a more specific Error class.
 *
 * @docsCategory errors
 */
export abstract class I18nError extends ApolloError {
    protected constructor(
        public message: string,
        public variables: { [key: string]: string | number } = {},
        code?: string,
        logLevel: LogLevel = LogLevel.Warn,
    ) {
        super(message, code);
        const logMessage = `${code || 'Error'}: ${message}`;
        switch (logLevel) {
            case LogLevel.Error:
                Logger.error(logMessage, undefined, this.stack);
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
