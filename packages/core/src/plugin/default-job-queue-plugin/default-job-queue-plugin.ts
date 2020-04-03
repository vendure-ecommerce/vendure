import { PluginCommonModule } from '../plugin-common.module';
import { VendurePlugin } from '../vendure-plugin';

import { JobRecord } from './job-record.entity';
import { SqlJobQueueStrategy } from './sql-job-queue-strategy';

/**
 * @description
 * A plugin which configures Vendure to use the SQL database to persist the JobQueue jobs.
 *
 * @docsCategory JobQueue
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [JobRecord],
    configuration: (config) => {
        config.jobQueueOptions.jobQueueStrategy = new SqlJobQueueStrategy();
        return config;
    },
})
export class DefaultJobQueuePlugin {}
