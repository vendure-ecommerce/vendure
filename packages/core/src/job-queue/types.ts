import { JobState } from '@vendure/common/lib/generated-types';
import { ID, JsonCompatible } from '@vendure/common/lib/shared-types';

import { Job } from './job';

/**
 * @description
 * Used to configure a new {@link JobQueue} instance.
 *
 * @docsCategory JobQueue
 * @docsPage types
 */
export interface CreateQueueOptions<T extends JobData<T>> {
    /**
     * @description
     * The name of the queue, e.g. "image processing", "re-indexing" etc.
     */
    name: string;
    /**
     * @description
     * How many jobs of this type may be run concurrently.
     */
    concurrency: number;
    /**
     * @description
     * Defines the work to be done for each job in the queue. When the work is complete,
     * `job.complete()` should be called, and for any errors, `job.fail()` should be called.
     * Unhandled exceptions will automatically call `job.fail()`.
     */
    process: (job: Job<T>) => any | Promise<any>;
}

/**
 * @description
 * A JSON-serializable data type which provides a {@link Job}
 * with the data it needs to be processed.
 *
 * @docsCategory JobQueue
 * @docsPage types
 */
export type JobData<T> = JsonCompatible<T>;

/**
 * @description
 * Used to instantiate a new {@link Job}
 *
 * @docsCategory JobQueue
 * @docsPage types
 */
export interface JobConfig<T extends JobData<T>> {
    queueName: string;
    data: T;
    retries?: number;
    attempts?: number;
    id?: ID;
    state?: JobState;
    progress?: number;
    result?: any;
    error?: any;
    createdAt?: Date;
    startedAt?: Date;
    settledAt?: Date;
}
