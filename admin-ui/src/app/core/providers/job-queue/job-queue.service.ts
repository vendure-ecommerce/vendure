import { Injectable, OnDestroy } from '@angular/core';
import { combineLatest, interval, Observable, Subject, Subscription } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    scan,
    shareReplay,
    throttle,
    throttleTime,
} from 'rxjs/operators';
import { assertNever } from 'shared/shared-utils';

import { GetJobInfo, JobInfoFragment, JobState } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Injectable()
export class JobQueueService implements OnDestroy {
    activeJobs$: Observable<JobInfoFragment[]>;

    private updateJob$ = new Subject<JobInfoFragment>();
    private onCompleteHandlers = new Map<string, (job: JobInfoFragment) => void>();
    private readonly subscription: Subscription;

    constructor(private dataService: DataService) {
        const initialJobList$ = this.dataService.settings
            .getRunningJobs()
            .single$.subscribe(data => data.jobs.forEach(job => this.updateJob$.next(job)));

        this.activeJobs$ = this.updateJob$.pipe(
            scan<JobInfoFragment, Map<string, JobInfoFragment>>(
                (jobMap, job) => this.handleJob(jobMap, job),
                new Map<string, JobInfoFragment>(),
            ),
            map(jobMap => Array.from(jobMap.values())),
            debounceTime(500),
            shareReplay(1),
        );

        this.subscription = combineLatest(this.activeJobs$, interval(5000))
            .pipe(throttleTime(5000))
            .subscribe(([jobs]) => {
                this.dataService.settings.pollJobs(jobs.map(j => j.id)).single$.subscribe(data => {
                    data.jobs.forEach(job => {
                        this.updateJob$.next(job);
                    });
                });
            });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    addJob(jobId: string, onComplete?: (job: JobInfoFragment) => void) {
        this.dataService.settings.getJob(jobId).single$.subscribe(({ job }) => {
            if (job) {
                this.updateJob$.next(job);
                if (onComplete) {
                    this.onCompleteHandlers.set(jobId, onComplete);
                }
            }
        });
    }

    private handleJob(jobMap: Map<string, JobInfoFragment>, job: JobInfoFragment) {
        switch (job.state) {
            case JobState.RUNNING:
            case JobState.PENDING:
                jobMap.set(job.id, job);
                break;
            case JobState.COMPLETED:
            case JobState.FAILED:
                jobMap.delete(job.id);
                const handler = this.onCompleteHandlers.get(job.id);
                if (handler) {
                    handler(job);
                    this.onCompleteHandlers.delete(job.id);
                }
                break;
        }
        return jobMap;
    }
}
