import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { JobQueueService } from '../../providers/job-queue/job-queue.service';

@Component({
    selector: 'vdr-job-link',
    templateUrl: './job-queue-link.component.html',
    styleUrls: ['./job-queue-link.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobQueueLinkComponent implements OnInit, OnDestroy {
    activeJobCount: number;
    private subscription: Subscription;

    constructor(private jobQueueService: JobQueueService, private changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit() {
        this.subscription = this.jobQueueService.activeJobs$
            .pipe(map((jobs) => jobs.length))
            .subscribe((value) => {
                this.activeJobCount = value;
                this.changeDetectorRef.markForCheck();
            });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
