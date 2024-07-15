import { ArgumentsHost, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { setContext } from '@sentry/node';
import { ErrorHandlerStrategy, I18nError, Injector, Job, LogLevel } from '@vendure/core';

import { SentryService } from './sentry.service';

export class SentryErrorHandlerStrategy implements ErrorHandlerStrategy {
    private sentryService: SentryService;

    init(injector: Injector) {
        this.sentryService = injector.get(SentryService);
    }

    handleServerError(exception: Error, { host }: { host: ArgumentsHost }) {
        // We only care about errors which have at least a Warn log level
        const shouldLogError = exception instanceof I18nError ? exception.logLevel <= LogLevel.Warn : true;
        if (shouldLogError) {
            if (host?.getType<GqlContextType>() === 'graphql') {
                const gqlContext = GqlExecutionContext.create(host as ExecutionContext);
                const info = gqlContext.getInfo();
                setContext('GraphQL Error Context', {
                    fieldName: info.fieldName,
                    path: info.path,
                });
            }
            const variables = (exception as any).variables;
            if (variables) {
                setContext('GraphQL Error Variables', variables);
            }
            this.sentryService.captureException(exception);
        }
    }

    handleWorkerError(exception: Error, { job }: { job: Job }) {
        setContext('Worker Context', {
            queueName: job.queueName,
            jobId: job.id,
        });
        this.sentryService.captureException(exception);
    }
}
