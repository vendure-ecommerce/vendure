import {
    DateOperators,
    JobFilterParameter,
    JobListOptions,
    JobSortParameter,
    JobState,
    NumberOperators,
    StringOperators,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';

import { generatePublicId } from '../common/generate-public-id';
import { JobQueueStrategy } from '../config/job-queue/job-queue-strategy';
import { Logger } from '../config/logger/vendure-logger';

import { Job } from './job';

/**
 * @description
 * An in-memory {@link JobQueueStrategy}. This is the default strategy if not using a dedicated
 * JobQueue plugin (e.g. {@link DefaultJobQueuePlugin}). Not recommended for production, since
 * the queue will be cleared when the server stops.
 * Completed jobs will be evicted from the store every 2 hours to prevent a memory leak.
 *
 * @docsCategory JobQueue
 */
export class InMemoryJobQueueStrategy implements JobQueueStrategy {
    protected jobs = new Map<ID, Job>();
    protected unsettledJobs: { [queueName: string]: Job[] } = {};
    private timer: any;
    private evictJobsAfterMs = 1000 * 60 * 60 * 2; // 2 hours

    init() {
        this.timer = setTimeout(this.evictSettledJobs, this.evictJobsAfterMs);
    }

    destroy() {
        clearTimeout(this.timer);
    }

    async add(job: Job): Promise<Job> {
        if (!job.id) {
            (job as any).id = Math.floor(Math.random() * 1000000000)
                .toString()
                .padEnd(10, '0');
        }
        // tslint:disable-next-line:no-non-null-assertion
        this.jobs.set(job.id!, job);
        if (!this.unsettledJobs[job.queueName]) {
            this.unsettledJobs[job.queueName] = [];
        }
        this.unsettledJobs[job.queueName].push(job);
        return job;
    }

    async findOne(id: ID): Promise<Job | undefined> {
        return this.jobs.get(id);
    }

    async findMany(options?: JobListOptions): Promise<PaginatedList<Job>> {
        let items = [...this.jobs.values()];
        if (options) {
            if (options.sort) {
                items = this.applySort(items, options.sort);
            }
            if (options.filter) {
                items = this.applyFilters(items, options.filter);
            }
            if (options.skip || options.take) {
                items = this.applyPagination(items, options.skip, options.take);
            }
        }
        return {
            items,
            totalItems: items.length,
        };
    }

    async findManyById(ids: ID[]): Promise<Job[]> {
        return ids.map(id => this.jobs.get(id)).filter(notNullOrUndefined);
    }

    async next(queueName: string): Promise<Job | undefined> {
        const next = this.unsettledJobs[queueName]?.shift();
        if (next) {
            next.start();
            return next;
        }
    }

    async update(job: Job): Promise<void> {
        if (job.state === JobState.RETRYING || job.state === JobState.PENDING) {
            this.unsettledJobs[job.queueName].unshift(job);
        }
        // tslint:disable-next-line:no-non-null-assertion
        this.jobs.set(job.id!, job);
    }

    async removeSettledJobs(queueNames: string[] = [], olderThan?: Date): Promise<number> {
        let removed = 0;
        for (const job of this.jobs.values()) {
            if (0 < queueNames.length && !queueNames.includes(job.queueName)) {
                continue;
            }
            if (job.isSettled) {
                if (olderThan) {
                    if (job.settledAt && job.settledAt < olderThan) {
                        // tslint:disable-next-line:no-non-null-assertion
                        this.jobs.delete(job.id!);
                        removed++;
                    }
                } else {
                    // tslint:disable-next-line:no-non-null-assertion
                    this.jobs.delete(job.id!);
                    removed++;
                }
            }
        }
        return removed;
    }

    private applySort(items: Job[], sort: JobSortParameter): Job[] {
        for (const [prop, direction] of Object.entries(sort)) {
            const key = prop as keyof Required<JobSortParameter>;
            const dir = direction === 'ASC' ? -1 : 1;
            items = items.sort((a, b) => ((a[key] || 0) < (b[key] || 0) ? 1 * dir : -1 * dir));
        }
        return items;
    }

    private applyFilters(items: Job[], filters: JobFilterParameter): Job[] {
        for (const [prop, operator] of Object.entries(filters)) {
            const key = prop as keyof Required<JobFilterParameter>;
            if (operator?.eq !== undefined) {
                items = items.filter(i => i[key] === operator.eq);
            }

            const contains = (operator as StringOperators)?.contains;
            if (contains) {
                items = items.filter(i => (i[key] as string).includes(contains));
            }
            const gt = (operator as NumberOperators)?.gt;
            if (gt) {
                items = items.filter(i => (i[key] as number) > gt);
            }
            const gte = (operator as NumberOperators)?.gte;
            if (gte) {
                items = items.filter(i => (i[key] as number) >= gte);
            }
            const lt = (operator as NumberOperators)?.lt;
            if (lt) {
                items = items.filter(i => (i[key] as number) < lt);
            }
            const lte = (operator as NumberOperators)?.lte;
            if (lte) {
                items = items.filter(i => (i[key] as number) <= lte);
            }
            const before = (operator as DateOperators)?.before;
            if (before) {
                items = items.filter(i => (i[key] as Date) <= before);
            }
            const after = (operator as DateOperators)?.after;
            if (after) {
                items = items.filter(i => (i[key] as Date) >= after);
            }
            const between = (operator as NumberOperators)?.between;
            if (between) {
                items = items.filter(i => {
                    const num = i[key] as number;
                    return num > between.start && num < between.end;
                });
            }
        }
        return items;
    }

    private applyPagination(items: Job[], skip?: number | null, take?: number | null): Job[] {
        const start = skip || 0;
        const end = take != null ? start + take : undefined;
        return items.slice(start, end);
    }

    /**
     * Delete old jobs from the `jobs` Map if they are settled and older than the value
     * defined in `this.pruneJobsAfterMs`. This prevents a memory leak as the job queue
     * grows indefinitely.
     */
    private evictSettledJobs = () => {
        const nowMs = +new Date();
        const olderThanMs = nowMs - this.evictJobsAfterMs;
        this.removeSettledJobs([], new Date(olderThanMs));
        this.timer = setTimeout(this.evictSettledJobs, this.evictJobsAfterMs);
    };
}
