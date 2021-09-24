import { JobListOptions, JobState } from '@vendure/common/lib/generated-types';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import {
    ID,
    Injector,
    InspectableJobQueueStrategy,
    InternalServerError,
    Job,
    JobData,
    Logger,
    PaginatedList,
} from '@vendure/core';
import Bull, { Processor, Queue, QueueScheduler, Worker, WorkerOptions } from 'bullmq';

import { ALL_JOB_TYPES, BULLMQ_PLUGIN_OPTIONS, loggerCtx } from './constants';
import { RedisHealthIndicator } from './redis-health-indicator';
import { BullMQPluginOptions } from './types';

const QUEUE_NAME = 'vendure-job-queue';
const DEFAULT_CONCURRENCY = 3;

/**
 * @description
 * This JobQueueStrategy uses [BullMQ](https://docs.bullmq.io/) to implement a push-based job queue
 * on top of Redis. It should not be used alone, but as part of the {@link BullMQJobQueuePlugin}.
 *
 * @docsCategory job-queue-plugin
 */
export class BullMQJobQueueStrategy implements InspectableJobQueueStrategy {
    private queue: Queue;
    private worker: Worker;
    private scheduler: QueueScheduler;
    private workerProcessor: Processor;
    private options: BullMQPluginOptions;
    private queueNameProcessFnMap = new Map<string, (job: Job) => Promise<any>>();

    async init(injector: Injector): Promise<void> {
        const options = injector.get<BullMQPluginOptions>(BULLMQ_PLUGIN_OPTIONS);
        this.options = options;

        const redisHealthIndicator = injector.get(RedisHealthIndicator);
        Logger.info(`Checking Redis connection...`, loggerCtx);
        const health = await redisHealthIndicator.isHealthy('redis');
        if (health.redis.status === 'down') {
            Logger.error('Could not connect to Redis', loggerCtx);
        } else {
            Logger.info(`Connected to Redis ✔`, loggerCtx);
        }

        this.queue = new Queue(QUEUE_NAME, {
            ...options.queueOptions,
            connection: options.connection,
        }).on('error', (e: any) => Logger.error(`BullMQ Queue error: ${e.message}`, loggerCtx, e.stack));

        if (await this.queue.isPaused()) {
            await this.queue.resume();
        }

        this.workerProcessor = async bullJob => {
            const queueName = bullJob.name;
            Logger.debug(
                `Job ${bullJob.id} [${queueName}] starting (attempt ${bullJob.attemptsMade + 1} of ${
                    bullJob.opts.attempts ?? 1
                })`,
            );
            const processFn = this.queueNameProcessFnMap.get(queueName);
            if (processFn) {
                const job = this.createVendureJob(bullJob);
                try {
                    job.on('progress', _job => bullJob.updateProgress(_job.progress));
                    const result = await processFn(job);
                    await bullJob.updateProgress(100);
                    return result;
                } catch (e) {
                    throw e;
                }
            }
            throw new InternalServerError(`No processor defined for the queue "${queueName}"`);
        };

        this.scheduler = new QueueScheduler(QUEUE_NAME, {
            ...options.schedulerOptions,
            connection: options.connection,
        }).on('error', (e: any) => Logger.error(`BullMQ Scheduler error: ${e.message}`, loggerCtx, e.stack));
    }

    async add<Data extends JobData<Data> = {}>(job: Job<Data>): Promise<Job<Data>> {
        const bullJob = await this.queue.add(job.queueName, job.data, {
            attempts: job.retries + 1,
            backoff: {
                delay: 1000,
                type: 'exponential',
            },
        });
        return this.createVendureJob(bullJob);
    }

    async cancelJob(jobId: string): Promise<Job | undefined> {
        const bullJob = await this.queue.getJob(jobId);
        if (bullJob) {
            try {
                await bullJob.remove();
                return this.createVendureJob(bullJob);
            } catch (e) {
                Logger.error(`Error when cancelling job: ${e.message}`, loggerCtx);
            }
        }
    }

    async findMany(options?: JobListOptions): Promise<PaginatedList<Job>> {
        const start = options?.skip ?? 0;
        const end = start + (options?.take ?? 10);
        let jobTypes = ALL_JOB_TYPES;
        const stateFilter = options?.filter?.state;
        if (stateFilter?.eq) {
            switch (stateFilter.eq) {
                case 'PENDING':
                    jobTypes = ['wait'];
                    break;
                case 'RUNNING':
                    jobTypes = ['active'];
                    break;
                case 'COMPLETED':
                    jobTypes = ['completed'];
                    break;
                case 'RETRYING':
                    jobTypes = ['repeat'];
                    break;
                case 'FAILED':
                    jobTypes = ['failed'];
                    break;
                case 'CANCELLED':
                    jobTypes = ['failed'];
                    break;
            }
        }
        const settledFilter = options?.filter?.isSettled;
        if (settledFilter?.eq != null) {
            jobTypes = settledFilter.eq === true ? ['completed', 'failed'] : ['wait', 'active', 'repeat'];
        }
        let items: Bull.Job[] = [];
        let jobCounts: { [index: string]: number } = {};
        try {
            items = await this.queue.getJobs(jobTypes, start, end);
        } catch (e) {
            Logger.error(e.message, loggerCtx, e.stack);
        }
        try {
            jobCounts = await this.queue.getJobCounts(...jobTypes);
        } catch (e) {
            Logger.error(e.message, loggerCtx, e.stack);
        }
        const totalItems = Object.values(jobCounts).reduce((sum, count) => sum + count, 0);

        return Promise.resolve({
            items: items
                .sort((a, b) => b.timestamp - a.timestamp)
                .map(bullJob => this.createVendureJob(bullJob)),
            totalItems,
        });
    }

    async findManyById(ids: ID[]): Promise<Job[]> {
        const bullJobs = await Promise.all(ids.map(id => this.queue.getJob(id.toString())));
        return bullJobs.filter(notNullOrUndefined).map(j => this.createVendureJob(j));
    }

    async findOne(id: ID): Promise<Job | undefined> {
        const bullJob = await this.queue.getJob(id.toString());
        if (bullJob) {
            return this.createVendureJob(bullJob);
        }
    }

    async removeSettledJobs(queueNames?: string[], olderThan?: Date): Promise<number> {
        try {
            const jobCounts = await this.queue.getJobCounts('completed', 'failed');
            await this.queue.clean(100, 0, 'completed');
            await this.queue.clean(100, 0, 'failed');
            return Object.values(jobCounts).reduce((sum, num) => sum + num, 0);
        } catch (e) {
            Logger.error(e.message, loggerCtx, e.stack);
            return 0;
        }
    }

    async start<Data extends JobData<Data> = {}>(
        queueName: string,
        process: (job: Job<Data>) => Promise<any>,
    ): Promise<void> {
        this.queueNameProcessFnMap.set(queueName, process);
        if (!this.worker) {
            const options: WorkerOptions = {
                concurrency: DEFAULT_CONCURRENCY,
                ...this.options.workerOptions,
                connection: this.options.connection,
            };
            this.worker = new Worker(QUEUE_NAME, this.workerProcessor, options)
                .on('error', (e: any) =>
                    Logger.error(`BullMQ Worker error: ${e.message}`, loggerCtx, e.stack),
                )
                .on('failed', (job: Bull.Job, failedReason: string) => {
                    Logger.warn(
                        `Job ${job.id} [${job.name}] failed (attempt ${job.attemptsMade} of ${
                            job.opts.attempts ?? 1
                        })`,
                    );
                })
                .on('completed', (job: Bull.Job, failedReason: string) => {
                    Logger.debug(`Job ${job.id} [${job.name}] completed`);
                });
        }
    }

    async stop<Data extends JobData<Data> = {}>(
        queueName: string,
        process: (job: Job<Data>) => Promise<any>,
    ): Promise<void> {
        await this.scheduler.disconnect();
        await this.queue.disconnect();
        await this.worker.disconnect();
    }

    private createVendureJob(bullJob: Bull.Job): Job {
        const jobJson = bullJob.toJSON();
        return new Job({
            queueName: bullJob.name,
            id: bullJob.id,
            state: this.getState(bullJob),
            data: bullJob.data,
            attempts: bullJob.attemptsMade,
            createdAt: new Date(jobJson.timestamp),
            startedAt: jobJson.processedOn ? new Date(jobJson.processedOn) : undefined,
            settledAt: jobJson.finishedOn ? new Date(jobJson.finishedOn) : undefined,
            error: jobJson.failedReason,
            progress: +jobJson.progress,
            result: jobJson.returnvalue,
            retries: bullJob.opts.attempts ?? 0,
        });
    }

    private getState(bullJob: Bull.Job): JobState {
        const jobJson = bullJob.toJSON();

        if (!jobJson.processedOn && !jobJson.failedReason) {
            return JobState.PENDING;
        }
        if (!jobJson.finishedOn) {
            return JobState.RUNNING;
        }
        if (jobJson.failedReason && bullJob.attemptsMade < (bullJob.opts.attempts ?? 0)) {
            return JobState.RETRYING;
        }
        if (jobJson.failedReason) {
            return JobState.FAILED;
        }
        if (jobJson.finishedOn) {
            return JobState.COMPLETED;
        }
        throw new InternalServerError('Could not determine job state');
        // TODO: how to handle "cancelled" state? Currently when we cancel a job, we simply remove all record of it.
    }
}
