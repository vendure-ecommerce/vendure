import { Span } from '@sentry/node';
import { NodeOptions } from '@sentry/node';

import { SENTRY_START_SPAN_INACTIVE_KEY } from './constants';

/**
 * @description
 * Configuration options for the {@link SentryPlugin}.
 *
 * @docsCategory core plugins/SentryPlugin
 */
export interface SentryPluginOptions extends NodeOptions {
    /**
     * @description
     * The [Data Source Name](https://docs.sentry.io/product/sentry-basics/concepts/dsn-explainer/) for your Sentry instance.
     */
    dsn: string;
    enableTracing?: boolean;
    includeErrorTestMutation?: boolean;
}

export type StartInactiveSpanFunction = (options: { name: string; op?: string }) => Span | undefined;

declare module 'express' {
    interface Request {
        [SENTRY_START_SPAN_INACTIVE_KEY]: StartInactiveSpanFunction | undefined;
    }
}
