import { JobState } from '@vendure/common/lib/generated-types';
import { Subject, Subscription } from 'rxjs';
import { throttleTime } from 'rxjs/operators';

import { JobQueueStrategy } from '../config';
import { Logger } from '../config/logger/vendure-logger';

import { Job } from './job';
import { CreateQueueOptions, JobConfig, JobData } from './types';

/**
 * @description
 * A JobQueue is used to process {@link Job}s. A job is added to the queue via the
 * `.add()` method, and the queue will then poll for new jobs and process each
 * according to the defined `process` function.
 *
 * *Note*: JobQueue instances should not be directly instantiated. Rather, the
 * {@link JobQueueService} `createQueue()` method should be used (see that service
 * for example usage).
 *
 * @docsCategory JobQueue
 */
export class JobQueue<Data extends JobData<Data> = {}> {
    private running = false;

    get name(): string {
        return this.options.name;
    }

    get started(): boolean {
        return this.running;
    }

    constructor(private options: CreateQueueOptions<Data>, private jobQueueStrategy: JobQueueStrategy) {}

    /** @internal */
    start() {
        if (this.running) {
            return;
        }
        this.running = true;
        this.jobQueueStrategy.start<Data>(this.options.name, this.options.process);
    }

    /** @internal */
    pause() {
        Logger.debug(`Pausing JobQueue "${this.options.name}"`);
        if (!this.running) {
            return;
        }
        this.running = false;
        this.jobQueueStrategy.stop(this.options.name, this.options.process);
    }

    /** @internal */
    async destroy(): Promise<void> {
        if (!this.running) {
            return;
        }
        this.running = false;
        return this.jobQueueStrategy.stop(this.options.name, this.options.process);
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
}
