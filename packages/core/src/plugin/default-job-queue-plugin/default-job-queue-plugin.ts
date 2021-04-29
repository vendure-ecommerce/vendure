import { Type } from '@vendure/common/lib/shared-types';

import { BackoffStrategy } from '../../job-queue/polling-job-queue-strategy';
import { PluginCommonModule } from '../plugin-common.module';
import { VendurePlugin } from '../vendure-plugin';

import { JobRecord } from './job-record.entity';
import { SqlJobQueueStrategy } from './sql-job-queue-strategy';

/**
 * @description
 * Configuration options for the DefaultJobQueuePlugin. These values get passed into the
 * {@link SqlJobQueueStrategy}.
 *
 * @docsCategory JobQueue
 * @docsPage DefaultJobQueuePlugin
 */
export interface DefaultJobQueueOptions {
    pollInterval?: number | ((queueName: string) => number);
    concurrency?: number;
    backoffStrategy?: BackoffStrategy;
}

/**
 * @description
 * A plugin which configures Vendure to use the SQL database to persist the JobQueue jobs using the {@link SqlJobQueueStrategy}. If you add this
 * plugin to an existing Vendure installation, you'll need to run a [database migration](/docs/developer-guide/migrations), since this
 * plugin will add a new "job_record" table to the database.
 *
 * @example
 * ```TypeScript
 * import { DefaultJobQueuePlugin, VendureConfig } from '\@vendure/core';
 *
 * export const config: VendureConfig = {
 *   // Add an instance of the plugin to the plugins array
 *   plugins: [
 *     DefaultJobQueuePlugin,
 *   ],
 * };
 * ```
 *
 * ## Configuration
 *
 * It is possible to configure the behaviour of the {@link SqlJobQueueStrategy} by passing options to the static `init()` function:
 *
 * ### pollInterval
 * The interval in ms between polling for new jobs. The default is 200ms.
 * Using a longer interval reduces load on the database but results in a slight
 * delay in processing jobs. For more control, it is possible to supply a function which can specify
 * a pollInterval based on the queue name:
 *
 * @example
 * ```TypeScript
 * export const config: VendureConfig = {
 *   plugins: [
 *     DefaultJobQueuePlugin.init({
 *       pollInterval: queueName => {
 *         if (queueName === 'cart-recovery-email') {
 *           // This queue does not need to be polled so frequently,
 *           // so we set a longer interval in order to reduce load
 *           // on the database.
 *           return 10000;
 *         }
 *         return 200;
 *       },
 *     }),
 *   ],
 * };
 * ```
 * ### concurrency
 * The number of jobs to process concurrently per worker. Defaults to 1.
 *
 * ### backoffStrategy
 * Defines the backoff strategy used when retrying failed jobs. In other words, if a job fails
 * and is configured to be re-tried, how long should we wait before the next attempt?
 *
 * By default a job will be retried as soon as possible, but in some cases this is not desirable. For example,
 * a job may interact with an unreliable 3rd-party API which is sensitive to too many requests. In this case, an
 * exponential backoff may be used which progressively increases the delay between each subsequent retry.
 *
 * @example
 * ```TypeScript
 * export const config: VendureConfig = {
 *   plugins: [
 *     DefaultJobQueuePlugin.init({
 *       pollInterval: 5000,
 *       concurrency: 2
 *       backoffStrategy: (queueName, attemptsMade, job) => {
 *         if (queueName === 'transcode-video') {
 *           // exponential backoff example
 *           return (attemptsMade ** 2) * 1000;
 *         }
 *
 *         // A default delay for all other queues
 *         return 1000;
 *       },
 *     }),
 *   ],
 * };
 * ```
 *
 * @docsCategory JobQueue
 * @docsWeight 0
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [JobRecord],
    configuration: config => {
        const { pollInterval, concurrency, backoffStrategy } = DefaultJobQueuePlugin.options ?? {};
        config.jobQueueOptions.jobQueueStrategy = new SqlJobQueueStrategy({
            concurrency,
            pollInterval,
            backoffStrategy,
        });
        return config;
    },
})
export class DefaultJobQueuePlugin {
    /** @internal */
    static options: DefaultJobQueueOptions;

    static init(options: DefaultJobQueueOptions): Type<DefaultJobQueuePlugin> {
        DefaultJobQueuePlugin.options = options;
        return DefaultJobQueuePlugin;
    }
}
