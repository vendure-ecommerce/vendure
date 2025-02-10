import { Inject, Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { CaptureContext, StartSpanOptions } from '@sentry/core';
import * as Sentry from '@sentry/node';

import { SENTRY_PLUGIN_OPTIONS } from './constants';
import { SentryPluginOptions } from './types';

@Injectable()
export class SentryService implements OnApplicationBootstrap, OnApplicationShutdown {
    constructor(@Inject(SENTRY_PLUGIN_OPTIONS) private options: SentryPluginOptions) {}

    onApplicationBootstrap(): any {
        Sentry.init({
            ...{ tracesSampleRate: 1.0 },
            ...this.options,
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

    startInactiveSpan(options: StartSpanOptions) {
        return Sentry.startInactiveSpan(options);
    }
}
