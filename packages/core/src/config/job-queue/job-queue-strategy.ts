import { ModuleRef } from '@nestjs/core';
import { JobListOptions } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { Job } from '../../job-queue/job';

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
    add(job: Job): Promise<Job>;

    /**
     * @description
     * Should return the next job in the given queue. The implementation is
     * responsible for returning the correct job according to the time of
     * creation.
     */
    next(queueName: string): Promise<Job | undefined>;

    /**
     * @description
     * Update the job details in the store.
     */
    update(job: Job): Promise<void>;

    /**
     * @description
     * Returns a job by its id.
     */
    findOne(id: ID): Promise<Job | undefined>;

    /**
     * @description
     * Returns a list of jobs according to the specified options.
     */
    findMany(options?: JobListOptions): Promise<PaginatedList<Job>>;

    /**
     * @description
     * Returns an array of jobs for the given ids.
     */
    findManyById(ids: ID[]): Promise<Job[]>;

    /**
     * @description
     * Remove all settled jobs in the specified queues older than the given date.
     * If no queueName is passed, all queues will be considered. If no olderThan
     * date is passed, all jobs older than the current time will be removed.
     *
     * Returns a promise of the number of jobs removed.
     */
    removeSettledJobs(queueNames?: string[], olderThan?: Date): Promise<number>;
}
