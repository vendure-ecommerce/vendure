import { Inject, Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { CaptureContext, TransactionContext } from '@sentry/types';

import { SENTRY_PLUGIN_OPTIONS } from './constants';
import { SentryPluginOptions } from './types';

@Injectable()
export class SentryService implements OnApplicationBootstrap, OnApplicationShutdown {
    constructor(@Inject(SENTRY_PLUGIN_OPTIONS) private options: SentryPluginOptions) {}

    onApplicationBootstrap(): any {
        const integrations = this.options.integrations ?? [
            new Sentry.Integrations.Http({ tracing: true }),
            ...Sentry.autoDiscoverNodePerformanceMonitoringIntegrations(),
        ];
        Sentry.init({
            ...this.options,
            tracesSampleRate: this.options.tracesSampleRate ?? 1.0,
            integrations,
            dsn: this.options.dsn,
        });
    }

    onApplicationShutdown() {
        return Sentry.close();
    }

    captureException(exception: Error) {
        Sentry.captureException(exception);
    }

    captureMessage(message: string, captureContext?: CaptureContext) {
        Sentry.captureMessage(message, captureContext);
    }

    startTransaction(context: TransactionContext) {
        return Sentry.startTransaction(context);
    }
}
