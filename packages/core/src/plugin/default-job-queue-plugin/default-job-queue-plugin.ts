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
 * @docsCategory JobQueue
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [JobRecord],
    configuration: config => {
        config.jobQueueOptions.jobQueueStrategy = new SqlJobQueueStrategy();
        return config;
    },
})
export class DefaultJobQueuePlugin {}
