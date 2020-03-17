import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Observable } from 'rxjs';

import { JobInfoFragment } from '../../common/generated-types';
import { JobQueueService } from '../../providers/job-queue/job-queue.service';

@Component({
    selector: 'vdr-job-list',
    templateUrl: './job-list.component.html',
    styleUrls: ['./job-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobListComponent implements OnInit {
    activeJobs$: Observable<JobInfoFragment[]>;

    constructor(private jobQueueService: JobQueueService) {}

    ngOnInit() {
        this.activeJobs$ = this.jobQueueService.activeJobs$;
    }

    getJobName(job: JobInfoFragment): string {
        switch (job.name) {
            case 'reindex':
                return _('job.reindex');
            default:
                return job.name;
        }
    }

    trackById(index: number, item: JobInfoFragment) {
        return item.id;
    }
}
