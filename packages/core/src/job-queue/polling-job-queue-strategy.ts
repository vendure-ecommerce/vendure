import { JobState } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { isObject } from '@vendure/common/lib/shared-utils';
import { interval, race, Subject, Subscription } from 'rxjs';
import { fromPromise } from 'rxjs/internal-compatibility';
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
export type BackoffStrategy = (queueName: string, attemptsMade: number, job: Job) => number;

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
     * The interval in ms between polling the database for new jobs.
     *
     * @description 200
     */
    pollInterval?: number | ((queueName: string) => number);
    /**
     * @description
     * The strategy used to decide how long to wait before retrying a failed job.
     *
     * @default () => 1000
     */
    backoffStrategy?: BackoffStrategy;
}

const STOP_SIGNAL = Symbol('STOP_SIGNAL');

class ActiveQueue<Data extends JobData<Data> = {}> {
    private timer: any;
    private running = false;
    private activeJobs: Array<Job<Data>> = [];

    private errorNotifier$ = new Subject<[string, string]>();
    private queueStopped$ = new Subject<typeof STOP_SIGNAL>();
    private subscription: Subscription;
    private readonly pollInterval: number;

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
                            // tslint:disable-next-line:no-non-null-assertion
                            switchMap(() => this.jobQueueStrategy.findOne(nextJob.id!)),
                            filter(job => job?.state === JobState.CANCELLED),
                            take(1),
                        );
                        const stopSignal$ = this.queueStopped$.pipe(take(1));

                        race(fromPromise(this.process(nextJob)), cancellationSignal$, stopSignal$)
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
                            .finally(() => {
                                if (!this.running && nextJob.state !== JobState.PENDING) {
                                    return;
                                }
                                nextJob.off('progress', onProgress);
                                return this.onFailOrComplete(nextJob);
                            })
                            .catch(err => {
                                Logger.warn(`Error updating job info: ${err}`);
                            });
                    }
                }
            } catch (e) {
                this.errorNotifier$.next([
                    `Job queue "${this.queueName}" encountered an error (set log level to Debug for trace): ${e.message}`,
                    e.stack,
                ]);
            }
            if (this.running) {
                this.timer = setTimeout(runNextJobs, this.pollInterval);
            }
        };

        runNextJobs();
    }

    stop(): Promise<void> {
        this.running = false;
        this.queueStopped$.next(STOP_SIGNAL);
        clearTimeout(this.timer);

        const start = +new Date();
        // Wait for 2 seconds to allow running jobs to complete
        const maxTimeout = 2000;
        let pollTimer: any;
        return new Promise(resolve => {
            const pollActiveJobs = async () => {
                const timedOut = +new Date() - start > maxTimeout;
                if (this.activeJobs.length === 0 || timedOut) {
                    clearTimeout(pollTimer);
                    resolve();
                } else {
                    pollTimer = setTimeout(pollActiveJobs, 50);
                }
            };
            pollActiveJobs();
        });
    }

    private async onFailOrComplete(job: Job<Data>) {
        await this.jobQueueStrategy.update(job);
        this.removeJobFromActive(job);
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
    public backOffStrategy?: BackoffStrategy;

    private activeQueues = new QueueNameProcessStorage<ActiveQueue<any>>();

    constructor(config?: PollingJobQueueStrategyConfig);
    constructor(concurrency?: number, pollInterval?: number);
    constructor(concurrencyOrConfig?: number | PollingJobQueueStrategyConfig, maybePollInterval?: number) {
        super();

        if (concurrencyOrConfig && isObject(concurrencyOrConfig)) {
            this.concurrency = concurrencyOrConfig.concurrency ?? 1;
            this.pollInterval = concurrencyOrConfig.pollInterval ?? 200;
            this.backOffStrategy = concurrencyOrConfig.backoffStrategy ?? (() => 1000);
        } else {
            this.concurrency = concurrencyOrConfig ?? 1;
            this.pollInterval = maybePollInterval ?? 200;
        }
    }

    async start<Data extends JobData<Data> = {}>(
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

    async stop<Data extends JobData<Data> = {}>(
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
}
