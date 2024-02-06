import { Type } from '@vendure/common/lib/shared-types';

import { Job } from '../../job-queue/job';
import { BackoffStrategy } from '../../job-queue/polling-job-queue-strategy';
import { PluginCommonModule } from '../plugin-common.module';
import { VendurePlugin } from '../vendure-plugin';

import { JobRecordBuffer } from './job-record-buffer.entity';
import { JobRecord } from './job-record.entity';
import { SqlJobBufferStorageStrategy } from './sql-job-buffer-storage-strategy';
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
    /**
     * @description
     * The interval in ms between polling the database for new jobs. If many job queues
     * are active, the polling may cause undue load on the database, in which case this value
     * should be increased to e.g. 1000.
     *
     * @default 200
     */
    pollInterval?: number | ((queueName: string) => number);
    /**
     * @description
     * How many jobs from a given queue to process concurrently.
     *
     * @default 1
     */
    concurrency?: number;
    /**
     * @description
     * The strategy used to decide how long to wait before retrying a failed job.
     *
     * @default () => 1000
     */
    backoffStrategy?: BackoffStrategy;
    /**
     * @description
     * When a job is added to the JobQueue using `JobQueue.add()`, the calling
     * code may specify the number of retries in case of failure. This option allows
     * you to override that number and specify your own number of retries based on
     * the job being added.
     *
     * @example
     * ```ts
     * setRetries: (queueName, job) => {
     *   if (queueName === 'send-email') {
     *     // Override the default number of retries
     *     // for the 'send-email' job because we have
     *     // a very unreliable email service.
     *     return 10;
     *   }
     *   return job.retries;
     * }
     *  ```
     * @param queueName
     * @param job
     */
    setRetries?: (queueName: string, job: Job) => number;
    /**
     * @description
     * If set to `true`, the database will be used to store buffered jobs. This is
     * recommended for production.
     *
     * When enabled, a new `JobRecordBuffer` database entity will be defined which will
     * require a migration when first enabling this option.
     *
     * @since 1.3.0
     */
    useDatabaseForBuffer?: boolean;
    /**
     * @description
     * The timeout in ms which the queue will use when attempting a graceful shutdown.
     * That means when the server is shut down but a job is running, the job queue will
     * wait for the job to complete before allowing the server to shut down. If the job
     * does not complete within this timeout window, the job will be forced to stop
     * and the server will shut down anyway.
     *
     * @since 2.2.0
     * @default 20_000
     */
    gracefulShutdownTimeout?: number;
}

/**
 * @description
 * A plugin which configures Vendure to use the SQL database to persist the JobQueue jobs using the {@link SqlJobQueueStrategy}. If you add this
 * plugin to an existing Vendure installation, you'll need to run a [database migration](/guides/developer-guide/migrations), since this
 * plugin will add a new "job_record" table to the database.
 *
 * @example
 * ```ts
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
 * ```ts
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
 * By default, a job will be retried as soon as possible, but in some cases this is not desirable. For example,
 * a job may interact with an unreliable 3rd-party API which is sensitive to too many requests. In this case, an
 * exponential backoff may be used which progressively increases the delay between each subsequent retry.
 *
 * @example
 * ```ts
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
 *       setRetries: (queueName, job) => {
 *         if (queueName === 'send-email') {
 *           // Override the default number of retries
 *           // for the 'send-email' job because we have
 *           // a very unreliable email service.
 *           return 10;
 *         }
 *         return job.retries;
 *       }
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
    entities: () =>
        DefaultJobQueuePlugin.options.useDatabaseForBuffer === true
            ? [JobRecord, JobRecordBuffer]
            : [JobRecord],
    configuration: config => {
        const { pollInterval, concurrency, backoffStrategy, setRetries, gracefulShutdownTimeout } =
            DefaultJobQueuePlugin.options ?? {};
        config.jobQueueOptions.jobQueueStrategy = new SqlJobQueueStrategy({
            concurrency,
            pollInterval,
            backoffStrategy,
            setRetries,
            gracefulShutdownTimeout,
        });
        if (DefaultJobQueuePlugin.options.useDatabaseForBuffer === true) {
            config.jobQueueOptions.jobBufferStorageStrategy = new SqlJobBufferStorageStrategy();
        }
        return config;
    },
    compatibility: '>0.0.0',
})
export class DefaultJobQueuePlugin {
    /** @internal */
    static options: DefaultJobQueueOptions = {};

    static init(options: DefaultJobQueueOptions): Type<DefaultJobQueuePlugin> {
        DefaultJobQueuePlugin.options = options;
        return DefaultJobQueuePlugin;
    }
}
