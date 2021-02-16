import { JobListOptions } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { InjectableStrategy } from '../../common';
import { JobData } from '../../job-queue';
import { Job } from '../../job-queue';

/**
 * @description
 * Defines how the jobs in the {@link JobQueueService} are persisted and
 * accessed. Custom strategies can be defined to make use of external
 * services such as Redis.
 *
 * @docsCategory JobQueue
 */
export interface JobQueueStrategy extends InjectableStrategy {
    /**
     * @description
     * Add a new job to the queue.
     */
    add<Data extends JobData<Data> = {}>(job: Job<Data>): Promise<Job<Data>>;

    /**
     * @description
     * Start the job queue
     */
    start<Data extends JobData<Data> = {}>(
        queueName: string,
        process: (job: Job<Data>) => Promise<any>,
    ): void;

    /**
     * @description
     * Stops a queue from running. Its not guaranteed to stop immediately.
     */
    stop<Data extends JobData<Data> = {}>(
        queueName: string,
        process: (job: Job<Data>) => Promise<any>,
    ): Promise<void>;
}
