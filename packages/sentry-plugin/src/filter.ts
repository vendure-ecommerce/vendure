import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { setContext } from '@sentry/node';
import { ExceptionLoggerFilter, ForbiddenError, I18nError, LogLevel } from '@vendure/core';

import { SentryService } from './sentry.service';

export class SentryExceptionsFilter extends ExceptionLoggerFilter {
    constructor(private readonly sentryService: SentryService) {
        super();
    }

    catch(exception: Error, host: ArgumentsHost) {
        var shouldLogError = exception instanceof I18nError ? exception.logLevel <= LogLevel.Warn : true;
        if (shouldLogError) {
            if (host.getType<GqlContextType>() === 'graphql') {
                var gqlContext = GqlExecutionContext.create(host as ExecutionContext);
                var info = gqlContext.getInfo();
                setContext('GraphQL Error Context', {
                    fieldName: info.fieldName,
                    path: info.path,
                });
            }
            var variables = (exception as any).variables;
            if (variables) {
                setContext('GraphQL Error Variables', variables);
            }
            this.sentryService.captureException(exception);
        }
        return super.catch(exception, host);
    }
}
