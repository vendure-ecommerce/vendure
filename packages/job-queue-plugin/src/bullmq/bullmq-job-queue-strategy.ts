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
import Bull, { ConnectionOptions, JobType, Processor, Queue, Worker, WorkerOptions } from 'bullmq';
import { EventEmitter } from 'events';
import { Cluster, Redis, RedisOptions } from 'ioredis';

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
 * @docsCategory core plugins/JobQueuePlugin
 */
export class BullMQJobQueueStrategy implements InspectableJobQueueStrategy {
    private redisConnection: Redis | Cluster;
    private connectionOptions: ConnectionOptions;
    private queue: Queue;
    private worker: Worker;
    private workerProcessor: Processor;
    private options: BullMQPluginOptions;
    private queueNameProcessFnMap = new Map<string, (job: Job) => Promise<any>>();

    async init(injector: Injector): Promise<void> {
        const options = injector.get<BullMQPluginOptions>(BULLMQ_PLUGIN_OPTIONS);
        this.options = options;
        this.connectionOptions =
            options.connection ??
            ({
                host: 'localhost',
                port: 6379,
                maxRetriesPerRequest: null,
            } as RedisOptions);

        this.redisConnection =
            this.connectionOptions instanceof EventEmitter
                ? this.connectionOptions
                : new Redis(this.connectionOptions);

        const redisHealthIndicator = injector.get(RedisHealthIndicator);
        Logger.info('Checking Redis connection...', loggerCtx);
        const health = await redisHealthIndicator.isHealthy('redis');
        if (health.redis.status === 'down') {
            Logger.error('Could not connect to Redis', loggerCtx);
        } else {
            Logger.info('Connected to Redis ✔', loggerCtx);
        }

        this.queue = new Queue(QUEUE_NAME, {
            ...options.queueOptions,
            connection: this.redisConnection,
        })
            .on('error', (e: any) =>
                Logger.error(`BullMQ Queue error: ${JSON.stringify(e.message)}`, loggerCtx, e.stack),
            )
            .on('resumed', () => Logger.verbose('BullMQ Queue resumed', loggerCtx))
            .on('paused', () => Logger.verbose('BullMQ Queue paused', loggerCtx));

        if (await this.queue.isPaused()) {
            await this.queue.resume();
        }

        this.workerProcessor = async bullJob => {
            const queueName = bullJob.name;
            Logger.debug(
                `Job ${bullJob.id ?? ''} [${queueName}] starting (attempt ${bullJob.attemptsMade + 1} of ${
                    bullJob.opts.attempts ?? 1
                })`,
            );
            const processFn = this.queueNameProcessFnMap.get(queueName);
            if (processFn) {
                const job = await this.createVendureJob(bullJob);
                try {
                    // eslint-disable-next-line
                    job.on('progress', _job => bullJob.updateProgress(_job.progress));
                    const result = await processFn(job);
                    await bullJob.updateProgress(100);
                    return result;
                } catch (e: any) {
                    throw e;
                }
            }
            throw new InternalServerError(`No processor defined for the queue "${queueName}"`);
        };
    }

    async destroy() {
        await Promise.all([this.queue.close(), this.worker?.close()]);
    }

    async add<Data extends JobData<Data> = object>(job: Job<Data>): Promise<Job<Data>> {
        const retries = this.options.setRetries?.(job.queueName, job) ?? job.retries;
        const backoff = this.options.setBackoff?.(job.queueName, job) ?? {
            delay: 1000,
            type: 'exponential',
        };
        const bullJob = await this.queue.add(job.queueName, job.data, {
            attempts: retries + 1,
            backoff,
        });
        return this.createVendureJob(bullJob);
    }

    async cancelJob(jobId: string): Promise<Job | undefined> {
        const bullJob = await this.queue.getJob(jobId);
        if (bullJob) {
            if (await bullJob.isActive()) {
                // Not yet possible in BullMQ, see
                // https://github.com/taskforcesh/bullmq/issues/632
                throw new InternalServerError('Cannot cancel a running job');
            }
            try {
                await bullJob.remove();
                return this.createVendureJob(bullJob);
            } catch (e: any) {
                const message = `Error when cancelling job: ${JSON.stringify(e.message)}`;
                Logger.error(message, loggerCtx);
                throw new InternalServerError(message);
            }
        }
    }

    async findMany(options?: JobListOptions): Promise<PaginatedList<Job>> {
        const start = options?.skip ?? 0;
        const end = start + (options?.take ?? 10);
        let jobTypes: JobType[] = ALL_JOB_TYPES;
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
            jobTypes =
                settledFilter.eq === true
                    ? ['completed', 'failed']
                    : ['wait', 'waiting-children', 'active', 'repeat', 'delayed', 'paused'];
        }
        let items: Bull.Job[] = [];
        let jobCounts: { [index: string]: number } = {};
        try {
            items = await this.queue.getJobs(jobTypes, start, end);
        } catch (e: any) {
            Logger.error(e.message, loggerCtx, e.stack);
        }
        try {
            jobCounts = await this.queue.getJobCounts(...jobTypes);
        } catch (e: any) {
            Logger.error(e.message, loggerCtx, e.stack);
        }
        const totalItems = Object.values(jobCounts).reduce((sum, count) => sum + count, 0);

        return {
            items: await Promise.all(
                items
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map(bullJob => this.createVendureJob(bullJob)),
            ),
            totalItems,
        };
    }

    async findManyById(ids: ID[]): Promise<Job[]> {
        const bullJobs = await Promise.all(ids.map(id => this.queue.getJob(id.toString())));
        return Promise.all(bullJobs.filter(notNullOrUndefined).map(j => this.createVendureJob(j)));
    }

    async findOne(id: ID): Promise<Job | undefined> {
        const bullJob = await this.queue.getJob(id.toString());
        if (bullJob) {
            return this.createVendureJob(bullJob);
        }
    }

    // TODO V2: actually make it use the olderThan parameter
    async removeSettledJobs(queueNames?: string[], olderThan?: Date): Promise<number> {
        try {
            const jobCounts = await this.queue.getJobCounts('completed', 'failed');
            await this.queue.clean(100, 0, 'completed');
            await this.queue.clean(100, 0, 'failed');
            return Object.values(jobCounts).reduce((sum, num) => sum + num, 0);
        } catch (e: any) {
            Logger.error(e.message, loggerCtx, e.stack);
            return 0;
        }
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async start<Data extends JobData<Data> = object>(
        queueName: string,
        process: (job: Job<Data>) => Promise<any>,
    ): Promise<void> {
        this.queueNameProcessFnMap.set(queueName, process);
        if (!this.worker) {
            const options: WorkerOptions = {
                concurrency: DEFAULT_CONCURRENCY,
                ...this.options.workerOptions,
                connection: this.redisConnection,
            };
            this.worker = new Worker(QUEUE_NAME, this.workerProcessor, options)
                .on('error', e => Logger.error(`BullMQ Worker error: ${e.message}`, loggerCtx, e.stack))
                .on('closing', e => Logger.verbose(`BullMQ Worker closing: ${e}`, loggerCtx))
                .on('closed', () => Logger.verbose('BullMQ Worker closed'))
                .on('failed', (job: Bull.Job | undefined, error) => {
                    Logger.warn(
                        `Job ${job?.id ?? '(unknown id)'} [${job?.name ?? 'unknown name'}] failed (attempt ${
                            job?.attemptsMade ?? 'unknown'
                        } of ${job?.opts.attempts ?? 1})`,
                    );
                })
                .on('stalled', (jobId: string) => {
                    Logger.warn(`BullMQ Worker: job ${jobId} stalled`, loggerCtx);
                })
                .on('completed', (job: Bull.Job) => {
                    Logger.debug(`Job ${job?.id ?? 'unknown id'} [${job.name}] completed`);
                });
        }
    }

    private stopped = false;
    async stop<Data extends JobData<Data> = object>(
        queueName: string,
        process: (job: Job<Data>) => Promise<any>,
    ): Promise<void> {
        if (!this.stopped) {
            this.stopped = true;
            try {
                await Promise.all([this.queue.close(), this.worker.close()]);
            } catch (e: any) {
                Logger.error(e, loggerCtx, e.stack);
            }
        }
    }

    private async createVendureJob(bullJob: Bull.Job): Promise<Job> {
        const jobJson = bullJob.toJSON();
        return new Job({
            queueName: bullJob.name,
            id: bullJob.id,
            state: await this.getState(bullJob),
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

    private async getState(bullJob: Bull.Job): Promise<JobState> {
        const jobJson = bullJob.toJSON();

        if ((await bullJob.isWaiting()) || (await bullJob.isWaitingChildren())) {
            return JobState.PENDING;
        }
        if (await bullJob.isActive()) {
            return JobState.RUNNING;
        }
        if (await bullJob.isDelayed()) {
            return JobState.RETRYING;
        }
        if (await bullJob.isFailed()) {
            return JobState.FAILED;
        }
        if (await bullJob.isCompleted()) {
            return JobState.COMPLETED;
        }
        if (!jobJson.finishedOn) {
            return JobState.CANCELLED;
        }
        throw new InternalServerError('Could not determine job state');
        // TODO: how to handle "cancelled" state? Currently when we cancel a job, we simply remove all record of it.
    }
}
