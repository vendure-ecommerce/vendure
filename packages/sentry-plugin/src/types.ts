import { Transaction } from '@sentry/node';
import { NodeOptions } from '@sentry/node/types/types';

import { SENTRY_TRANSACTION_KEY } from './constants';

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

declare module 'express' {
    interface Request {
        [SENTRY_TRANSACTION_KEY]: Transaction | undefined;
    }
}
