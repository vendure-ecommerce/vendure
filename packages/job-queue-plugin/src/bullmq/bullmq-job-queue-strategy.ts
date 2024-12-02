import { JobListOptions, JobState } from '@vendure/common/lib/generated-types';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import {
    ID,
    idsAreEqual,
    Injector,
    InspectableJobQueueStrategy,
    InternalServerError,
    Job,
    JobData,
    JobQueue,
    JobQueueService,
    Logger,
    PaginatedList,
} from '@vendure/core';
import Bull, { ConnectionOptions, JobType, Processor, Queue, Worker, WorkerOptions } from 'bullmq';
import { EventEmitter } from 'events';
import { Cluster, Redis, RedisOptions } from 'ioredis';
import { firstValueFrom, Subject, Subscription, lastValueFrom } from 'rxjs';
import { map, tap, filter, takeUntil, debounceTime } from 'rxjs/operators';

import { ALL_JOB_TYPES, BULLMQ_PLUGIN_OPTIONS, loggerCtx } from './constants';
import { RedisHealthIndicator } from './redis-health-indicator';
import { BullMQPluginOptions } from './types';

const QUEUE_NAME_PREFIX = 'vendure-queue-';
const DEFAULT_CONCURRENCY = 3;

const QUEUE_ID_BITS = 12; // 12 bits for the queue ID (supports 4096 queues)
const JOB_ID_BITS = 41; // 41 bits for the job ID (supports ~2 trillion jobs per queue)
// eslint-disable-next-line no-bitwise
const MAX_QUEUE_ID = (1 << QUEUE_ID_BITS) - 1; // Max queue ID (65535)

export class GracefulShutdownTimeoutError extends Error {
    constructor(message: string) {
        super(message);
    }
}

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
    private queues: Map<string, Queue> = new Map();
    // A unique integer ID assigned to each queue, used to generate a unique job ID
    // from the combination of queue ID and job ID.
    private queueIds: Map<string, number> = new Map();
    private workers: Map<string, Worker> = new Map();
    private workerProcessor: Processor;
    private options: BullMQPluginOptions;
    private queueNameProcessFnMap = new Map<string, (job: Job) => Promise<any>>();
    private cancellationSub: Redis;
    // emits a globalId of a job to cancel
    private cancelRunningJob$ = new Subject<string>();
    private forceFailRunningJob$ = new Subject<string>();
    private readonly CANCEL_JOB_CHANNEL = 'cancel-job';
    private readonly CANCELLED_JOB_LIST_NAME = 'vendure:cancelled-jobs';
    private jobQueueService: JobQueueService;

    /**
     * Currently, this strategy does not support listing all jobs across all queues.
     * This limitation was introduced in v3.1.0 and may be lifted in a future version.
     *
     * The reason for this chance was a switch from using a single BullMQ queue for all jobs to using
     * a separate queue for each JobQueue. This change was made to allow for more fine-grained control
     * over the processing of different types of jobs.
     */
    readonly supportsListAllQueues = false;

    async init(injector: Injector): Promise<void> {
        const options = injector.get<BullMQPluginOptions>(BULLMQ_PLUGIN_OPTIONS);
        this.jobQueueService = injector.get(JobQueueService);
        this.options = {
            ...options,
            workerOptions: {
                ...options.workerOptions,
                removeOnComplete: options.workerOptions?.removeOnComplete ?? {
                    age: 60 * 60 * 24 * 30,
                    count: 5000,
                },
                removeOnFail: options.workerOptions?.removeOnFail ?? {
                    age: 60 * 60 * 24 * 30,
                    count: 5000,
                },
            },
        };
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

        await this.setupQueues();

        this.workerProcessor = async bullJob => {
            const queueName = bullJob.name;
            const cancelled$ = this.cancelRunningJob$.asObservable();
            Logger.debug(
                `Job ${bullJob.id ?? ''} [${queueName}] starting (attempt ${bullJob.attemptsMade + 1} of ${
                    bullJob.opts.attempts ?? 1
                })`,
            );
            const processFn = this.queueNameProcessFnMap.get(queueName);
            if (processFn) {
                const job = await this.createVendureJob(bullJob);
                const completed$ = new Subject<void>();
                let subscription: Subscription | undefined;
                try {
                    // eslint-disable-next-line
                    job.on('progress', _job => bullJob.updateProgress(_job.progress));

                    const jobWasCancelled = new Promise(resolve => {
                        subscription = cancelled$.subscribe(val => {
                            if (idsAreEqual(val, job.id)) {
                                Logger.warn(`Setting job ${job.id ?? ''} as cancelled`, loggerCtx);
                                job.cancel();
                                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                resolve(new Error(`Job ${job.name}:${job.id} was cancelled`));
                            }
                        });
                    });

                    const result = await Promise.race([
                        processFn(job),
                        firstValueFrom(
                            this.forceFailRunningJob$.asObservable().pipe(
                                takeUntil(completed$),
                                map(
                                    () =>
                                        new GracefulShutdownTimeoutError(
                                            `Job ${job.name} was force failed on shutdown because it was still running after the gracefulShutdownTimeout period`,
                                        ),
                                ),
                            ),
                        ),
                        jobWasCancelled,
                    ]);

                    // await new Promise(resolve => setTimeout(resolve, 100));
                    if (result instanceof Error) {
                        throw result;
                    }

                    await bullJob.updateProgress(100);
                    return result;
                } catch (e: any) {
                    throw e;
                } finally {
                    if (job.id) {
                        await this.redisConnection.srem(this.CANCELLED_JOB_LIST_NAME, job.id?.toString());
                    }
                    completed$.next();
                    completed$.complete();
                    subscription?.unsubscribe();
                }
            }
            throw new InternalServerError(`No processor defined for the queue "${queueName}"`);
        };

        // Subscription-mode Redis connection for the cancellation messages
        this.cancellationSub = new Redis(this.connectionOptions as RedisOptions);
    }

    getBullQueueName(queue: JobQueue | string) {
        const namePrefixRe = new RegExp(`^${QUEUE_NAME_PREFIX}`);
        const queueNameString = typeof queue === 'string' ? queue : queue.name;
        return namePrefixRe.test(queueNameString)
            ? queueNameString
            : `${QUEUE_NAME_PREFIX}${queueNameString}`;
    }

    getOrCreateBullQueue(queueName: string) {
        const bullQueueName = this.getBullQueueName(queueName);
        const bullQueue = this.queues.get(bullQueueName);

        if (bullQueue) {
            return bullQueue;
        }

        return this.setupQueue(queueName);
    }

    private async setupQueues() {
        const queues = this.jobQueueService.getRawJobQueues();

        for (const queue of queues) {
            await this.setupQueue(queue);
        }
    }

    private async setupQueue(queue: JobQueue | string) {
        const allQueues = this.jobQueueService.getRawJobQueues();
        const queueIndex = allQueues.findIndex(
            q => q.name === (typeof queue === 'string' ? queue : queue.name),
        );
        if (queueIndex > MAX_QUEUE_ID) {
            throw new Error('Exceeded maximum number of queues');
        }
        const bullQueueName = this.getBullQueueName(queue);
        const bullQueue = new Queue(bullQueueName, {
            ...this.options.queueOptions,
            connection: this.redisConnection,
        })
            .on('error', (e: any) =>
                Logger.error(`BullMQ Queue error: ${JSON.stringify(e.message)}`, loggerCtx, e.stack),
            )
            .on('resumed', () => Logger.verbose('BullMQ Queue resumed', loggerCtx))
            .on('paused', () => Logger.verbose('BullMQ Queue paused', loggerCtx));

        if (await bullQueue.isPaused()) {
            await bullQueue.resume();
        }

        Logger.info(`Queue "${bullQueueName}" created.`, loggerCtx);

        this.queues.set(bullQueueName, bullQueue);
        this.queueIds.set(bullQueueName, queueIndex);

        return bullQueue;
    }

    async destroy() {
        await Promise.all([this.closeAllQueues(), this.closeAllWorkers()]);
    }

    async add<Data extends JobData<Data> = object>(job: Job<Data>): Promise<Job<Data>> {
        const retries = this.options.setRetries?.(job.queueName, job) ?? job.retries ?? 0;
        const backoff = this.options.setBackoff?.(job.queueName, job) ?? {
            delay: 1000,
            type: 'exponential',
        };

        const bullQueue = await this.getOrCreateBullQueue(job.queueName);

        const bullJob = await bullQueue.add(job.queueName, job.data, {
            attempts: retries + 1,
            backoff,
        });

        return this.createVendureJob(bullJob);
    }

    async cancelJob(globalId: number): Promise<Job | undefined> {
        const bullJob = await this.getBullJobFromGlobalId(globalId);
        if (bullJob) {
            if ((await bullJob.isActive()) && bullJob.id) {
                await this.setActiveJobAsCancelled(globalId);
                const jobToCancel = await this.createVendureJob(bullJob);
                return new Job({
                    ...jobToCancel,
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    id: jobToCancel.id!,
                    state: JobState.CANCELLED,
                    settledAt: new Date(),
                    data: jobToCancel.data,
                });
            } else {
                try {
                    const job = await this.createVendureJob(bullJob);
                    await bullJob.remove();
                    return job;
                } catch (e: any) {
                    const message = `Error when cancelling job: ${JSON.stringify(e.message)}`;
                    Logger.error(message, loggerCtx);
                    throw new InternalServerError(message);
                }
            }
        }
    }

    getGlobalId(queueName: string, jobId: number) {
        const queueID = this.queueIds.get(queueName);
        if (queueID == null) {
            throw new Error(`Queue "${queueName}" not found`);
        }
        // eslint-disable-next-line no-bitwise
        if (jobId >= 1 << JOB_ID_BITS) {
            throw new Error('Job ID exceeds maximum allowed value');
        }
        // eslint-disable-next-line no-bitwise
        return (queueID << JOB_ID_BITS) | jobId;
    }

    async findMany(options?: JobListOptions): Promise<PaginatedList<Job>> {
        const skip = options?.skip ?? 0;
        const take = options?.take ?? 10;
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
        let totalItems = 0;
        const queueNameIsEqualFilter = options?.filter?.queueName?.eq;

        try {
            if (queueNameIsEqualFilter) {
                const bullQueue = await this.getOrCreateBullQueue(queueNameIsEqualFilter);
                items = (await bullQueue?.getJobs(jobTypes, skip, take)) ?? [];

                // items = (
                //     await Promise.all(
                //         items
                //             .filter(job => notNullOrUndefined(job.id))
                //             .map(job => {
                //                 return this.findOneBullJob(
                //                     this.buildUniqueJobId(
                //                         this.getBullQueueName(queueNameIsEqualFilter),
                //                         Number(job.id),
                //                     ),
                //                 );
                //             }),
                //     )
                // ).filter(notNullOrUndefined);

                const jobCounts = (await bullQueue?.getJobCounts(...jobTypes)) ?? 0;
                totalItems = Object.values(jobCounts).reduce((sum, num) => sum + num, 0);
            }
        } catch (e: any) {
            throw new InternalServerError(e.message);
        }

        return {
            items: await Promise.all(items.map(bullJob => this.createVendureJob(bullJob))),
            totalItems,
        };
    }

    async findManyById(ids: ID[]): Promise<Job[]> {
        let bullJobs: Bull.Job[] = [];

        for (const queue of this.queues.values()) {
            const jobs = await Promise.all(ids.map(id => queue.getJob(id.toString())));
            bullJobs = bullJobs.concat(jobs.filter(notNullOrUndefined));
        }

        // TODO: fix this type assertion
        return bullJobs as unknown as Job[];
    }

    async findOne(globalId: ID): Promise<Job | undefined> {
        const bullJob = await this.getBullJobFromGlobalId(+globalId);

        if (bullJob) {
            return this.createVendureJob(bullJob);
        }

        Logger.info(`Job with id ${globalId} not found`, loggerCtx);
    }

    private async getBullJobFromGlobalId(globalId: number): Promise<Bull.Job | undefined> {
        // eslint-disable-next-line no-bitwise
        const queueId = (globalId >> JOB_ID_BITS) & MAX_QUEUE_ID;
        // eslint-disable-next-line no-bitwise
        const jobId = globalId & ((1 << JOB_ID_BITS) - 1);
        const queueName = Array.from(this.queueIds.entries()).find(([_, index]) => index === queueId)?.[0];

        if (!queueName) {
            return undefined;
        }
        const bullQueue = await this.getOrCreateBullQueue(queueName);
        return bullQueue?.getJob(jobId.toString());
    }

    async removeSettledJobs(queueNames?: string[], olderThan?: Date): Promise<number> {
        const queuesToProcess = this.getAllQueues(queueNames);

        const defaultGracePeriod = 100;
        const gracePeriod = olderThan
            ? this.calculateGracePeriod(olderThan, defaultGracePeriod)
            : defaultGracePeriod;

        try {
            let totalRemoved = 0;
            for (const [bullQueueName, queue] of queuesToProcess) {
                const jobCounts = await queue.getJobCounts('completed', 'failed');

                await queue.clean(gracePeriod, 0, 'completed');
                await queue.clean(gracePeriod, 0, 'failed');

                totalRemoved += Object.values(jobCounts).reduce((sum, num) => sum + num, 0);
            }

            return totalRemoved;
        } catch (e: any) {
            Logger.error(e.message, loggerCtx, e.stack);
            return 0;
        }
    }

    private calculateGracePeriod(olderThan: Date, fallback: number) {
        const currentTime = new Date().getTime(); // Get the current date and time
        const gracePeriod = currentTime - olderThan.getTime(); // Calculate the difference in milliseconds

        if (gracePeriod < 0) {
            return fallback;
        }

        return gracePeriod;
    }

    private getAllQueues(queueNames?: string[]) {
        // TODO: check if there is a better way to do that
        if (queueNames && queueNames.length > 0) {
            const queues: Map<string, Queue> = new Map();
            for (const queueName of queueNames) {
                const queue = this.queues.get(this.getBullQueueName(queueName));
                if (queue) {
                    queues.set(queueName, queue);
                }
            }

            return queues;
        }

        return this.queues;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async start<Data extends JobData<Data> = object>(
        queueName: string,
        process: (job: Job<Data>) => Promise<any>,
    ): Promise<void> {
        const bullQueueName = this.getBullQueueName(queueName);

        this.queueNameProcessFnMap.set(queueName, process);

        const worker = this.workers.get(bullQueueName);

        if (!worker) {
            const options: WorkerOptions = {
                concurrency: DEFAULT_CONCURRENCY,
                ...this.options.workerOptions,
                connection: this.redisConnection,
            };

            const newWorker = new Worker(bullQueueName, this.workerProcessor, options)
                .on('error', e => Logger.error(`BullMQ Worker error: ${e.message}`, loggerCtx, e.stack))
                .on('closing', e => Logger.verbose(`BullMQ Worker closing: ${e}`, loggerCtx))
                .on('closed', () => Logger.verbose('BullMQ Worker closed', loggerCtx))
                .on('failed', (job: Bull.Job | undefined, error) => {
                    Logger.warn(
                        `Job ${job?.id ?? '(unknown id)'} [${job?.name ?? 'unknown name'}] failed (attempt ${
                            job?.attemptsMade ?? 'unknown'
                        } of ${job?.opts.attempts ?? 1})`,
                        loggerCtx,
                    );
                })
                .on('stalled', (jobId: string) => {
                    Logger.warn(`BullMQ Worker: job ${jobId} stalled`, loggerCtx);
                })
                .on('completed', (job: Bull.Job) => {
                    Logger.debug(`Job ${job?.id ?? 'unknown id'} [${job.name}] completed`, loggerCtx);
                });
            await this.cancellationSub.subscribe(this.CANCEL_JOB_CHANNEL);
            this.cancellationSub.on('message', this.subscribeToCancellationEvents);

            this.workers.set(bullQueueName, newWorker);
        }
    }

    private subscribeToCancellationEvents = (channel: string, jobId: string) => {
        if (channel === this.CANCEL_JOB_CHANNEL && jobId) {
            this.cancelRunningJob$.next(jobId);
        }
    };

    private stopped = false;

    async stop<Data extends JobData<Data> = object>(
        queueName: string,
        process: (job: Job<Data>) => Promise<any>,
    ): Promise<void> {
        if (!this.stopped) {
            this.stopped = true;
            try {
                Logger.info(`Closing worker`, loggerCtx);
                const gracefulShutdownTimeout = this.options.gracefulShutdownTimeout ?? 1000 * 60 * 10;
                const startTime = Date.now();
                let timer: NodeJS.Timeout;
                const checkActive = async (resolve: (value: boolean) => void) => {
                    let activeCount = 0;
                    const activeJobs: Bull.Job[] = [];
                    for (const queue of this.queues.values()) {
                        const queueActiveCount = await queue.getActiveCount();
                        activeCount += queueActiveCount;
                        if (0 < queueActiveCount) {
                            const queueActiveJobs = await queue.getActive();
                            activeJobs.push(...queueActiveJobs);
                        }
                    }
                    if (0 < activeCount) {
                        Logger.info(
                            `Waiting on ${activeCount} active ${
                                activeCount > 1 ? 'jobs' : 'job'
                            } (${activeJobs.map(j => this.getGlobalId(j.queueName, Number(j.id))).join(', ')})...`,
                            loggerCtx,
                        );
                        if (Date.now() - startTime > gracefulShutdownTimeout) {
                            // If we've waited too long, just close the worker
                            // timer = setTimeout(checkActive, 2000);
                            Logger.warn(
                                `The graceful shutdown timeout of ${gracefulShutdownTimeout}ms has been exceeded. ` +
                                    `Setting ${activeCount} jobs as failed...`,
                                loggerCtx,
                            );
                            this.forceFailRunningJob$.next('all');
                            Logger.warn('All active jobs set as failed', loggerCtx);
                            resolve(false);
                        } else {
                            timer = setTimeout(() => checkActive(resolve), 2000);
                        }
                    } else {
                        resolve(true);
                    }
                };
                const gracefullyStopped = await new Promise(resolve => checkActive(resolve));

                await this.closeAllWorkers();
                Logger.info(`Worker closed`, loggerCtx);
                await this.closeAllQueues();
                // clearTimeout(timer);
                Logger.info(`Queue closed`, loggerCtx);
                this.cancellationSub.off('message', this.subscribeToCancellationEvents);
            } catch (e: any) {
                Logger.error(e, loggerCtx, e.stack);
            }
        }
    }

    private async closeAllWorkers(force = false) {
        for (const worker of this.workers.values()) {
            await worker.close(force);
        }
    }

    private async closeAllQueues() {
        for (const queue of this.queues.values()) {
            await queue.close();
        }
    }

    private async setActiveJobAsCancelled(globalId: number) {
        // Not yet possible natively in BullMQ, see
        // https://github.com/taskforcesh/bullmq/issues/632
        // So we have our own custom method of marking a job as cancelled.
        await this.redisConnection.publish(this.CANCEL_JOB_CHANNEL, globalId.toString());
        await this.redisConnection.sadd(this.CANCELLED_JOB_LIST_NAME, globalId.toString());
    }

    private async createVendureJob(bullJob: Bull.Job): Promise<Job> {
        const jobJson = bullJob.toJSON();
        return new Job({
            queueName: bullJob.name,
            id: this.getGlobalId(bullJob.queueName, Number(bullJob.id)),
            state: await this.getState(bullJob),
            data: bullJob.data,
            attempts: bullJob.attemptsMade,
            createdAt: new Date(jobJson.timestamp),
            startedAt: jobJson.processedOn ? new Date(jobJson.processedOn) : undefined,
            settledAt: jobJson.finishedOn ? new Date(jobJson.finishedOn) : undefined,
            error: jobJson.failedReason,
            progress: +jobJson.progress,
            result: jobJson.returnvalue,
            retries: bullJob.opts.attempts ? bullJob.opts.attempts - 1 : 0,
        });
    }

    private async getState(bullJob: Bull.Job): Promise<JobState> {
        const jobId = bullJob.id?.toString();

        if ((await bullJob.isWaiting()) || (await bullJob.isWaitingChildren())) {
            return JobState.PENDING;
        }
        if (await bullJob.isActive()) {
            const isCancelled =
                jobId && (await this.redisConnection.sismember(this.CANCELLED_JOB_LIST_NAME, jobId));
            if (isCancelled) {
                return JobState.CANCELLED;
            } else {
                return JobState.RUNNING;
            }
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
        throw new InternalServerError('Could not determine job state');
        // TODO: how to handle "cancelled" state? Currently when we cancel a job, we simply remove all record of it.
    }
}
