import { PluginCommonModule } from '../plugin-common.module';
import { VendurePlugin } from '../vendure-plugin';

import { JobRecord } from './job-record.entity';
import { SqlJobQueueStrategy } from './sql-job-queue-strategy';

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
 * @example
 * ```TypeScript
 * export const config: VendureConfig = {
 *   plugins: [
 *     DefaultJobQueuePlugin.init({
 *       // The interval in ms between polling for new jobs. The default is 200ms.
 *       // Using a longer interval reduces load on the database but results in a slight
 *       // delay in processing jobs.
 *       pollInterval: 5000,
 *       // The number of jobs to process concurrently per worker. Defaults to 1.
 *       concurrency: 2
 *     }),
 *   ],
 * };
 * ```
 *
 * @docsCategory JobQueue
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [JobRecord],
    configuration: config => {
        const { pollInterval, concurrency } = DefaultJobQueuePlugin.options ?? {};
        config.jobQueueOptions.jobQueueStrategy = new SqlJobQueueStrategy(concurrency, pollInterval);
        return config;
    },
})
export class DefaultJobQueuePlugin {
    static options: { pollInterval?: number; concurrency?: number };
    static init(options: { pollInterval?: number; concurrency?: number }) {
        DefaultJobQueuePlugin.options = options;
        return DefaultJobQueuePlugin;
    }
}
