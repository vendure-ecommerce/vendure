import { JobState } from '@vendure/common/lib/generated-types';

import { JobQueueStrategy } from '../config/job-queue/job-queue-strategy';

import { Job } from './job';
import { CreateQueueOptions, JobConfig, JobData } from './types';

/**
 * @description
 * A JobQueue is used to process {@link Job}s. A job is added to the queue via the
 * `.add()` method, and the queue will then poll for new jobs and process each
 * according to the process
 *
 * @docsCateogory JobQueue
 */
export class JobQueue<Data extends JobData<Data> = {}> {
    private activeJobs: Array<Job<Data>> = [];
    private timer: any;
    private fooId: number;
    private running = false;

    get concurrency(): number {
        return this.options.concurrency;
    }

    get name(): string {
        return this.options.name;
    }

    get started(): boolean {
        return this.running;
    }

    constructor(
        private options: CreateQueueOptions<Data>,
        private jobQueueStrategy: JobQueueStrategy,
        private pollInterval: number,
    ) {}

    /** @internal */
    start() {
        if (this.running) {
            return;
        }
        this.running = true;
        const concurrency = this.options.concurrency;
        const runNextJobs = async () => {
            const runningJobsCount = this.activeJobs.length;
            for (let i = runningJobsCount; i < concurrency; i++) {
                const nextJob: Job<Data> | undefined = await this.jobQueueStrategy.next(this.options.name);
                if (nextJob) {
                    this.activeJobs.push(nextJob);
                    await this.jobQueueStrategy.update(nextJob);
                    nextJob.on('complete', (job) => this.onFailOrComplete(job));
                    nextJob.on('fail', (job) => this.onFailOrComplete(job));
                    try {
                        const returnVal = this.options.process(nextJob);
                        if (returnVal instanceof Promise) {
                            returnVal.catch((err) => nextJob.fail(err));
                        }
                    } catch (err) {
                        nextJob.fail(err);
                    }
                }
            }
            this.timer = setTimeout(runNextJobs, this.pollInterval);
        };

        runNextJobs();
    }

    /** @internal */
    pause() {
        this.running = false;
        clearTimeout(this.timer);
    }

    /** @internal */
    async destroy(): Promise<void> {
        this.running = false;
        clearTimeout(this.timer);
        const start = +new Date();
        // Wait for 2 seconds to allow running jobs to complete
        const maxTimeout = 2000;
        return new Promise((resolve) => {
            const pollActiveJobs = async () => {
                const timedOut = +new Date() - start > maxTimeout;
                if (this.activeJobs.length === 0 || timedOut) {
                    // if there are any incomplete jobs after the 2 second
                    // wait period, set them back to "pending" so they can
                    // be re-run on next bootstrap.
                    for (const job of this.activeJobs) {
                        job.defer();
                        await this.jobQueueStrategy.update(job);
                    }
                    resolve();
                } else {
                    setTimeout(pollActiveJobs, 50);
                }
            };
            pollActiveJobs();
        });
    }

    /**
     * @description
     * Adds a new {@link Job} to the queue.
     */
    add(data: Data, options?: Pick<JobConfig<Data>, 'retries'>) {
        const job = new Job<any>({
            data,
            queueName: this.options.name,
            retries: options?.retries ?? 0,
        });
        return this.jobQueueStrategy.add(job);
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
