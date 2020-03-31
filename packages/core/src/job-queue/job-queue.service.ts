import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { JobListOptions } from '@vendure/common/lib/generated-types';

import { PaginatedList } from '../../../common/src/shared-types';
import { ConfigService } from '../config/config.service';
import { JobQueueStrategy } from '../config/job-queue/job-queue-strategy';

import { Job } from './job';
import { JobQueue } from './job-queue';
import { CreateQueueOptions, JobData } from './types';

/**
 * @description
 * The JobQueueService is used to create new {@link JobQueue} instances and access
 * existing jobs.
 *
 * @docsCateogory JobQueue
 */
@Injectable()
export class JobQueueService implements OnModuleInit, OnModuleDestroy {
    private cleanJobsTimer: NodeJS.Timeout;
    private queues: Array<JobQueue<any>> = [];

    private get jobQueueStrategy(): JobQueueStrategy {
        return this.configService.jobQueueOptions.jobQueueStrategy;
    }

    constructor(private configService: ConfigService, private moduleRef: ModuleRef) {}

    /** @internal */
    async onModuleInit() {
        const { jobQueueStrategy } = this.configService.jobQueueOptions;
        if (typeof jobQueueStrategy.init === 'function') {
            await jobQueueStrategy.init(this.moduleRef);
        }
    }

    /** @internal */
    onModuleDestroy() {
        for (const queue of this.queues) {
            queue.destroy();
        }
    }

    /**
     * @description
     * Configures and creates a new {@link JobQueue} instance.
     */
    createQueue<Data extends JobData<Data>>(options: CreateQueueOptions<Data>): JobQueue<Data> {
        const { jobQueueStrategy, pollInterval } = this.configService.jobQueueOptions;
        const queue = new JobQueue(options, jobQueueStrategy, pollInterval);
        queue.start();
        this.queues.push(queue);
        return queue;
    }

    /**
     * @description
     * Gets a job by id. The implementation is handled by the configured
     * {@link JobQueueStrategy}.
     */
    getJob(id: string): Promise<Job | undefined> {
        return this.jobQueueStrategy.findOne(id);
    }

    /**
     * @description
     * Gets jobs according to the supplied options. The implementation is handled by the configured
     * {@link JobQueueStrategy}.
     */
    getJobs(options?: JobListOptions): Promise<PaginatedList<Job>> {
        return this.jobQueueStrategy.findMany(options);
    }

    /**
     * @description
     * Gets jobs by ids. The implementation is handled by the configured
     * {@link JobQueueStrategy}.
     */
    getJobsById(ids: string[]): Promise<Job[]> {
        return this.jobQueueStrategy.findManyById(ids);
    }
}
