import { ID } from '@vendure/common/lib/shared-types';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import { Logger } from '../config/logger/vendure-logger';

import { InjectableJobQueueStrategy } from './injectable-job-queue-strategy';
import { Job } from './job';
import { QueueNameProcessStorage } from './queue-name-process-storage';
import { JobData } from './types';

class ActiveQueue<Data extends JobData<Data> = {}> {
    private timer: any;
    private running = false;
    private activeJobs: Array<Job<Data>> = [];

    private errorNotifier$ = new Subject<[string, string]>();
    private subscription: Subscription;

    constructor(
        private readonly queueName: string,
        private readonly process: (job: Job<Data>) => Promise<any>,
        private readonly jobQueueStrategy: PollingJobQueueStrategy,
    ) {
        this.subscription = this.errorNotifier$.pipe(throttleTime(3000)).subscribe(([message, stack]) => {
            Logger.error(message);
            Logger.debug(stack);
        });
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
                        this.process(nextJob)
                            .then(
                                result => {
                                    nextJob.complete(result);
                                },
                                err => {
                                    nextJob.fail(err);
                                },
                            )
                            .finally(() => {
                                if (!this.running) {
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
                this.timer = setTimeout(runNextJobs, this.jobQueueStrategy.pollInterval);
            }
        };

        runNextJobs();
    }

    stop(): Promise<void> {
        this.running = false;
        clearTimeout(this.timer);

        const start = +new Date();
        // Wait for 2 seconds to allow running jobs to complete
        const maxTimeout = 2000;
        return new Promise(resolve => {
            const pollActiveJobs = async () => {
                const timedOut = +new Date() - start > maxTimeout;
                if (this.activeJobs.length === 0 || timedOut) {
                    // if there are any incomplete jobs after the 2 second
                    // wait period, set them back to "pending" so they can
                    // be re-run on next bootstrap.
                    for (const job of this.activeJobs) {
                        job.defer();
                        try {
                            await this.jobQueueStrategy.update(job);
                        } catch (err) {
                            Logger.info(`Error stopping job queue: ${err}`);
                        }
                    }
                    resolve();
                } else {
                    setTimeout(pollActiveJobs, 50);
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
 */
export abstract class PollingJobQueueStrategy extends InjectableJobQueueStrategy {
    private activeQueues = new QueueNameProcessStorage<ActiveQueue<any>>();

    constructor(public concurrency: number = 1, public pollInterval: number = 200) {
        super();
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
