import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, ExecutionContext } from '@nestjs/common';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { setContext } from '@sentry/node';

import { SentryService } from './sentry.service';

@Catch()
export class SentryExceptionsFilter implements ExceptionFilter {
    constructor(private readonly sentryService: SentryService) {}

    catch(exception: Error, host: ArgumentsHost): void {
        if (host.getType<GqlContextType>() === 'graphql') {
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
