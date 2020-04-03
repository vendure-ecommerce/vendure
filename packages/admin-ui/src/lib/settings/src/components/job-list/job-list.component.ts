import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
    BaseListComponent,
    DataService,
    GetAllJobs,
    GetFacetList,
    GetJobQueueList,
    ModalService,
    NotificationService,
    SortOrder,
} from '@vendure/admin-ui/core';
import { Observable, timer } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'vdr-job-link',
    templateUrl: './job-list.component.html',
    styleUrls: ['./job-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobListComponent extends BaseListComponent<GetAllJobs.Query, GetAllJobs.Items>
    implements OnInit {
    queues$: Observable<GetJobQueueList.JobQueues[]>;
    liveUpdate = new FormControl(true);
    hideSettled = new FormControl(true);
    queueFilter = new FormControl('all');

    constructor(
        private dataService: DataService,
        private modalService: ModalService,
        private notificationService: NotificationService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        super.setQueryFn(
            (...args: any[]) => this.dataService.settings.getAllJobs(...args),
            (data) => data.jobs,
            (skip, take) => {
                const queueFilter =
                    this.queueFilter.value === 'all' ? null : { queueName: { eq: this.queueFilter.value } };
                const hideSettled = this.hideSettled.value;
                return {
                    options: {
                        skip,
                        take,
                        filter: {
                            ...queueFilter,
                            ...(hideSettled ? { isSettled: { eq: false } } : {}),
                        },
                        sort: {
                            createdAt: SortOrder.DESC,
                        },
                    },
                };
            },
        );
    }

    ngOnInit(): void {
        super.ngOnInit();
        timer(5000, 2000)
            .pipe(
                takeUntil(this.destroy$),
                filter(() => this.liveUpdate.value),
            )
            .subscribe(() => {
                this.refresh();
            });
        this.queues$ = this.dataService.settings
            .getJobQueues()
            .mapStream((res) => res.jobQueues)
            .pipe(
                map((queues) => {
                    return [{ name: 'all', running: true }, ...queues];
                }),
            );
    }

    hasResult(job: GetAllJobs.Items): boolean {
        const result = job.result;
        if (result == null) {
            return false;
        }
        if (typeof result === 'object') {
            return Object.keys(result).length > 0;
        }
        return true;
    }
}
