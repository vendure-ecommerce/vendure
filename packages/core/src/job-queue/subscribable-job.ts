import { JobState } from '@vendure/common/lib/generated-types';
import { pick } from '@vendure/common/lib/pick';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import ms from 'ms';
import { interval, Observable } from 'rxjs';
import { distinctUntilChanged, filter, map, switchMap, takeWhile, tap } from 'rxjs/operators';

import { InternalServerError } from '../common/error/errors';
import { isInspectableJobQueueStrategy } from '../config/job-queue/inspectable-job-queue-strategy';
import { JobQueueStrategy } from '../config/job-queue/job-queue-strategy';

import { Job } from './job';
import { JobConfig, JobData } from './types';

/**
 * @description
 * Job update status as returned from the {@link SubscribableJob}'s `update()` method.
 *
 * @docsCategory JobQueue
 * @docsPage types
 */
export type JobUpdate<T extends JobData<T>> = Pick<
    Job<T>,
    'id' | 'state' | 'progress' | 'result' | 'error' | 'data'
>;

/**
 * @description
 * This is a type of Job object that allows you to subscribe to updates to the Job. It is returned
 * by the {@link JobQueue}'s `add()` method. Note that the subscription capability is only supported
 * if the {@link JobQueueStrategy} implements the {@link InspectableJobQueueStrategy} interface (e.g.
 * the {@link SqlJobQueueStrategy} does support this).
 *
 * @docsCategory JobQueue
 */
export class SubscribableJob<T extends JobData<T> = any> extends Job<T> {
    private readonly jobQueueStrategy: JobQueueStrategy;

    constructor(job: Job<T>, jobQueueStrategy: JobQueueStrategy) {
        const config: JobConfig<T> = {
            ...job,
            state: job.state,
            data: job.data,
            id: job.id || undefined,
        };
        super(config);
        this.jobQueueStrategy = jobQueueStrategy;
    }

    /**
     * @description
     * Returns an Observable stream of updates to the Job. Works by polling the current JobQueueStrategy's `findOne()` method
     * to obtain updates. If this updates are not subscribed to, then no polling occurs.
     *
     * The polling interval defaults to 200ms, but can be configured by passing in an options argument. Polling will also timeout
     * after 1 hour, but this timeout can also be configured by passing the `timeoutMs` option.
     */
    updates(options?: { pollInterval?: number; timeoutMs?: number }): Observable<JobUpdate<T>> {
        const pollInterval = Math.max(50, options?.pollInterval ?? 200);
        const timeoutMs = Math.max(pollInterval, options?.timeoutMs ?? ms('1h'));
        const strategy = this.jobQueueStrategy;
        if (!isInspectableJobQueueStrategy(strategy)) {
            throw new InternalServerError(
                `The configured JobQueueStrategy (${strategy.constructor.name}) is not inspectable, so Job updates cannot be subscribed to`,
            );
        } else {
            // tslint:disable-next-line:no-non-null-assertion
            return interval(pollInterval).pipe(
                tap(i => {
                    if (timeoutMs < i * pollInterval) {
                        throw new Error(
                            `Job ${this.id} update polling timed out after ${timeoutMs}ms. The job may still be running.`,
                        );
                    }
                }),
                switchMap(() => {
                    const id = this.id;
                    if (!id) {
                        throw new Error(`Cannot subscribe to update: Job does not have an ID`);
                    }
                    return strategy.findOne(id);
                }),
                filter(notNullOrUndefined),
                distinctUntilChanged((a, b) => a?.progress === b?.progress),
                takeWhile(
                    job =>
                        job?.state !== JobState.FAILED &&
                        job.state !== JobState.COMPLETED &&
                        job.state !== JobState.CANCELLED,
                    true,
                ),
                tap(job => {
                    if (job.state === JobState.FAILED) {
                        throw new Error(job.error);
                    }
                }),
                map(job => pick(job, ['id', 'state', 'progress', 'result', 'error', 'data'])),
            );
        }
    }
}
