import { JobListOptions, JobState } from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { JobQueueStrategy } from '../config/job-queue/job-queue-strategy';

import { Job } from './job';

/**
 * @description
 * An in-memory {@link JobQueueStrategy} design for testing purposes. Not to be used in production
 * since all jobs are lost when the server stops.
 */
export class TestingJobQueueStrategy implements JobQueueStrategy {
    private jobs: Job[] = [];

    prePopulate(jobs: Job[]) {
        this.jobs.push(...jobs);
    }

    async add(job: Job): Promise<Job> {
        this.jobs.push(job);
        return job;
    }

    async findOne(id: string): Promise<Job | undefined> {
        return this.jobs.find((j) => j.id === id);
    }

    async findMany(options?: JobListOptions): Promise<PaginatedList<Job>> {
        // The sort, filter, paginate logic is not implemented because
        // it is not needed for testing purposes.
        const items = this.jobs;
        return {
            items,
            totalItems: items.length,
        };
    }

    async findManyById(ids: string[]): Promise<Job[]> {
        return this.jobs.filter((job) => ids.includes(job.id));
    }

    async next(queueName: string): Promise<Job | undefined> {
        const next = this.jobs.find((job) => {
            return (
                (job.state === JobState.PENDING || job.state === JobState.RETRYING) &&
                job.queueName === queueName
            );
        });
        if (next) {
            next.start();
            return next;
        }
    }

    async update(job: Job): Promise<void> {
        const index = this.jobs.findIndex((j) => j.id === job.id);
        if (-1 < index) {
            this.jobs.splice(index, 1, job);
        }
    }
}
