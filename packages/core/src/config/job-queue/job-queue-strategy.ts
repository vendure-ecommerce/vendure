import { ModuleRef } from '@nestjs/core';
import { JobListOptions } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { Job } from '../../job-queue/job';

/**
 * @description
 * Defines how the jobs in the {@link JobQueueService} are persisted and
 * accessed. Custom strategies can be defined to make use of external
 * services such as Redis.
 *
 * @docsCateogry JobQueue
 */
export interface JobQueueStrategy {
    /**
     * @description
     * Initialization logic to be run when after the Vendure server has been initialized
     * (in the Nestjs [onApplicationBootstrap hook](https://docs.nestjs.com/fundamentals/lifecycle-events)).
     *
     * Receives an instance of the application's ModuleRef, which can be used to inject
     * providers:
     *
     * @example
     * ```TypeScript
     * init(moduleRef: ModuleRef) {
     *     const myService = moduleRef.get(MyService, { strict: false });
     * }
     * ```
     */
    init?(moduleRef: ModuleRef): void | Promise<void>;

    /**
     * @description
     * Teardown logic to be run when the Vendure server shuts down.
     */
    destroy?(): void | Promise<void>;

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
    findOne(id: string): Promise<Job | undefined>;

    /**
     * @description
     * Returns a list of jobs according to the specified options.
     */
    findMany(options?: JobListOptions): Promise<PaginatedList<Job>>;

    /**
     * @description
     * Returns an array of jobs for the given ids.
     */
    findManyById(ids: string[]): Promise<Job[]>;
}
