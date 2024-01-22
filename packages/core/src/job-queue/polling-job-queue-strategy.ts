import { JobListOptions, JobState } from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { isObject } from '@vendure/common/lib/shared-utils';
import { from, interval, race, Subject, Subscription } from 'rxjs';
import { filter, switchMap, take, throttleTime } from 'rxjs/operators';

import { Logger } from '../config/logger/vendure-logger';

import { InjectableJobQueueStrategy } from './injectable-job-queue-strategy';
import { Job } from './job';
import { QueueNameProcessStorage } from './queue-name-process-storage';
import { JobData } from './types';

/**
 * @description
 * Defines the backoff strategy used when retrying failed jobs. Returns the delay in
 * ms that should pass before the failed job is retried.
 *
 * @docsCategory JobQueue
 * @docsPage types
 */
export type BackOffStrategy = (queueName: string, attemptsMade: number, job: Job) => number;

export interface PollingJobQueueStrategyConfig {
    /**
     * @description
     * How many jobs from a given queue to process concurrently.
     *
     * @default 1
     */
    concurrency?: number;

    /**
     * @description
     * The interval in ms between polling the database for new jobs. If many job queues
     * are active, the polling may cause undue load on the database, in which case this value
     * should be increased to e.g. 1000.
     *
     * @default 200
     */
    pollInterval?: number | ((queueName: string) => number);

    /**
     * @description
     * When a job is added to the JobQueue using `JobQueue.add()`, the calling
     * code may specify the number of retries in case of failure. This option allows
     * you to override that number and specify your own number of retries based on
     * the job being added.
     *
     * @example
     * ```ts
     * setRetries: (queueName, job) => {
     *   if (queueName === 'send-email') {
     *     // Override the default number of retries
     *     // for the 'send-email' job because we have
     *     // a very unreliable email service.
     *     return 10;
     *   }
     *   return job.retries;
     * }
     *  ```
     * @param queueName
     * @param job
     */
    setRetries?: (queueName: string, job: Job) => number;

    /**
     * @description
     * The strategy used to decide how long to wait before retrying a failed job.
     *
     * @default () => 1000
     */
    backOffStrategy?: BackOffStrategy;

    /**
     * @description
     * The stop active queue timeout in ms. If undefined, no timeout is applied.
     *
     * @default undefined
     */
    stopActiveQueueTimeout?: number | ((queueName: string) => number);
}

const STOP_SIGNAL = Symbol('STOP_SIGNAL');

class ActiveQueue<Data extends JobData<Data> = object> {
    private timer: any;
    private running = false;
    private activeJobs: Array<Job<Data>> = [];

    private errorNotifier$ = new Subject<[string, string]>();
    private queueStopped$ = new Subject<typeof STOP_SIGNAL>();
    private subscription: Subscription;
    private readonly pollInterval: number;
    private readonly stopActiveQueueTimeout?: number;

    constructor(
        private readonly queueName: string,
        private readonly process: (job: Job<Data>) => Promise<any>,
        private readonly jobQueueStrategy: PollingJobQueueStrategy,
    ) {
        this.subscription = this.errorNotifier$.pipe(throttleTime(3000)).subscribe(([message, stack]) => {
            Logger.error(message);
            Logger.debug(stack);
        });
        this.pollInterval =
            typeof this.jobQueueStrategy.pollInterval === 'function'
                ? this.jobQueueStrategy.pollInterval(queueName)
                : this.jobQueueStrategy.pollInterval;
        this.stopActiveQueueTimeout =
            typeof this.jobQueueStrategy.stopActiveQueueTimeout === 'function'
                ? this.jobQueueStrategy.stopActiveQueueTimeout(queueName)
                : this.jobQueueStrategy.stopActiveQueueTimeout;
    }

    start() {
        Logger.debug(`Starting JobQueue "${this.queueName}"`);
        this.running = true;
        const runNextJobs = async () => {
            try {
                const runningJobsCount = this.activeJobs.length;
                for (let i = runningJobsCount; i < this.jobQueueStrategy.concurrency; i++) {
                    const nextJob = await this.jobQueueStrategy.next(this.queueName);
                    if (nextJob) {
                        this.activeJobs.push(nextJob);
                        await this.jobQueueStrategy.update(nextJob);
                        const onProgress = (job: Job) => this.jobQueueStrategy.update(job);
                        nextJob.on('progress', onProgress);
                        const cancellationSignal$ = interval(this.pollInterval * 5).pipe(
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            switchMap(() => this.jobQueueStrategy.findOne(nextJob.id!)),
                            filter(job => job?.state === JobState.CANCELLED),
                            take(1),
                        );
                        const stopSignal$ = this.queueStopped$.pipe(take(1));

                        race(from(this.process(nextJob)), cancellationSignal$, stopSignal$)
                            .toPromise()
                            .then(
                                result => {
                                    if (result === STOP_SIGNAL) {
                                        nextJob.defer();
                                    } else if (result instanceof Job && result.state === JobState.CANCELLED) {
                                        nextJob.cancel();
                                    } else {
                                        nextJob.complete(result);
                                    }
                                },
                                err => {
                                    nextJob.fail(err);
                                },
                            )
                            .finally(async () => {
                                if (
                                    !this.running &&
                                    ![JobState.PENDING, JobState.COMPLETED].includes(nextJob.state)
                                ) {
                                    return;
                                }
                                nextJob.off('progress', onProgress);
                                await this.jobQueueStrategy.update(nextJob);
                                this.removeJobFromActive(nextJob);
                            })
                            .catch((err: any) => {
                                Logger.warn(`Error updating job info: ${JSON.stringify(err)}`);
                            });
                    }
                }
            } catch (e: any) {
                this.errorNotifier$.next([
                    `Job queue "${
                        this.queueName
                    }" encountered an error (set log level to Debug for trace): ${JSON.stringify(e.message)}`,
                    e.stack,
                ]);
            }
            if (this.running) {
                this.timer = setTimeout(runNextJobs, this.pollInterval);
            }
        };

        void runNextJobs();
    }

    stop(): Promise<void> {
        this.running = false;
        clearTimeout(this.timer);
        return this.syncOnActiveQueueStopped();
    }

    private syncOnActiveQueueStopped(): Promise<void> {
        const start = +new Date();
        let timeout: ReturnType<typeof setTimeout>;
        return new Promise(resolve => {
            const sync = async () => {
                const timedOut =
                    this.stopActiveQueueTimeout === undefined
                        ? false
                        : +new Date() - start > this.stopActiveQueueTimeout;
                if (this.activeJobs.length === 0) {
                    resolve();
                }

                if (timedOut) {
                    this.queueStopped$.next(STOP_SIGNAL);
                    resolve();
                }

                timeout = setTimeout(sync, 50);
            };
            void sync();
        });
    }

    private removeJobFromActive(job: Job<Data>) {
        const index = this.activeJobs.indexOf(job);
        this.activeJobs.splice(index, 1);
    }
}

/**
 * @description
 * This class allows easier implementation of {@link JobQueueStrategy} in a polling style.
 * Instead of providing {@link JobQueueStrategy} `start()` you should provide a `next` method.
 *
 * This class should be extended by any strategy which does not support a push-based system
 * to notify on new jobs. It is used by the {@link SqlJobQueueStrategy} and {@link InMemoryJobQueueStrategy}.
 *
 * @docsCategory JobQueue
 */
export abstract class PollingJobQueueStrategy extends InjectableJobQueueStrategy {
    public concurrency: number;
    public pollInterval: number | ((queueName: string) => number);
    public setRetries: (queueName: string, job: Job) => number;
    public backOffStrategy: BackOffStrategy;
    public stopActiveQueueTimeout?: number | ((queueName: string) => number);

    private activeQueues = new QueueNameProcessStorage<ActiveQueue<any>>();

    constructor(
        concurrencyOrConfig?: number | PollingJobQueueStrategyConfig,
        pollInterval?: number | ((queueName: string) => number),
        setRetries?: (queueName: string, job: Job) => number,
        backOffStrategy?: BackOffStrategy,
        stopActiveQueueTimeout?: number | ((queueName: string) => number),
    ) {
        super();

        const defaultConcurrency = 1;
        const defaultPollInterval = 200;
        const defaultSetRetries = (_: string, job: Job) => job.retries;
        const defaultBackOffStrategy = () => 1000;

        if (concurrencyOrConfig && isObject(concurrencyOrConfig)) {
            this.concurrency = concurrencyOrConfig.concurrency ?? defaultConcurrency;
            this.pollInterval = concurrencyOrConfig.pollInterval ?? defaultPollInterval;
            this.setRetries = concurrencyOrConfig.setRetries ?? defaultSetRetries;
            this.backOffStrategy = concurrencyOrConfig.backOffStrategy ?? defaultBackOffStrategy;
            this.stopActiveQueueTimeout = concurrencyOrConfig.stopActiveQueueTimeout;
        } else {
            this.concurrency = concurrencyOrConfig ?? defaultConcurrency;
            this.pollInterval = pollInterval ?? defaultPollInterval;
            this.setRetries = setRetries ?? defaultSetRetries;
            this.backOffStrategy = backOffStrategy ?? defaultBackOffStrategy;
            this.stopActiveQueueTimeout = stopActiveQueueTimeout;
        }
    }

    async start<Data extends JobData<Data> = object>(
        queueName: string,
        process: (job: Job<Data>) => Promise<any>,
    ) {
        if (!this.hasInitialized) {
            this.started.set(queueName, process);
            return;
        }
        if (this.activeQueues.has(queueName, process)) {
            return;
        }
        const active = new ActiveQueue<Data>(queueName, process, this);
        active.start();
        this.activeQueues.set(queueName, process, active);
    }

    async stop<Data extends JobData<Data> = object>(
        queueName: string,
        process: (job: Job<Data>) => Promise<any>,
    ) {
        const active = this.activeQueues.getAndDelete(queueName, process);
        if (!active) {
            return;
        }
        await active.stop();
    }

    async cancelJob(jobId: ID): Promise<Job | undefined> {
        const job = await this.findOne(jobId);
        if (job) {
            job.cancel();
            await this.update(job);
            return job;
        }
    }

    /**
     * @description
     * Should return the next job in the given queue. The implementation is
     * responsible for returning the correct job according to the time of
     * creation.
     */
    abstract next(queueName: string): Promise<Job | undefined>;

    /**
     * @description
     * Update the job details in the store.
     */
    abstract update(job: Job): Promise<void>;

    /**
     * @description
     * Returns a job by its id.
     */
    abstract findOne(id: ID): Promise<Job | undefined>;

    /**
     * @description
     * Returns a list of jobs according to the specified options.
     */
    abstract findMany(options?: JobListOptions): Promise<PaginatedList<Job>>;
}
