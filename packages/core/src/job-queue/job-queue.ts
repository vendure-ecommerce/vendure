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
    get concurrency(): number {
        return this.options.concurrency;
    }

    get name(): string {
        return this.options.name;
    }

    constructor(
        private options: CreateQueueOptions<Data>,
        private jobQueueStrategy: JobQueueStrategy,
        private pollInterval: number,
    ) {}

    /** @internal */
    start() {
        const runNextJobs = async () => {
            const concurrency = this.options.concurrency;
            const runningJobsCount = this.activeJobs.length;
            for (let i = runningJobsCount; i < concurrency; i++) {
                const nextJob: Job<Data> | undefined = await this.jobQueueStrategy.next(this.options.name);
                if (nextJob) {
                    this.activeJobs.push(nextJob);
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
                    await this.jobQueueStrategy.update(nextJob);
                }
            }
            this.timer = setTimeout(runNextJobs, this.pollInterval);
        };

        runNextJobs();
    }

    /** @internal */
    pause() {
        clearTimeout(this.timer);
    }

    /** @internal */
    destroy() {
        clearTimeout(this.timer);
    }

    /** @internal */
    _process(job: Job<Data>) {
        this.options.process(job);
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
