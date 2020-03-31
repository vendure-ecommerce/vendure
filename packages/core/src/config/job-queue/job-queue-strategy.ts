import { ModuleRef } from '@nestjs/core';
import { PaginatedList } from '@vendure/common/lib/shared-types';
import { JobListOptions } from '@vendure/common/src/generated-types';
import { Connection } from 'typeorm';

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
    init?(moduleRef: ModuleRef): void | Promise<void>;
    add(job: Job): Promise<Job>;
    next(queueName: string): Promise<Job | undefined>;
    update(job: Job): Promise<void>;
    findOne(id: string): Promise<Job | undefined>;
    findMany(options?: JobListOptions): Promise<PaginatedList<Job>>;
    findManyById(ids: string[]): Promise<Job[]>;
}
