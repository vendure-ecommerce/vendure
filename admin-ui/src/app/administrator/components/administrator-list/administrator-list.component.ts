import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-administrator-list',
    templateUrl: './administrator-list.component.html',
    styleUrls: ['./administrator-list.component.scss'],
})
export class AdministratorListComponent implements OnInit, OnDestroy {
    administrators$: Observable<any[]>;
    totalItems$: Observable<number>;
    itemsPerPage$: Observable<number>;
    currentPage$: Observable<number>;
    private destroy$ = new Subject<void>();

    constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        const administratorsQuery = this.dataService.administrator.getAdministrators(10, 0);

        const fetchPage = ([currentPage, itemsPerPage]: [number, number]) => {
            const take = itemsPerPage;
            const skip = (currentPage - 1) * itemsPerPage;
            administratorsQuery.ref.refetch({ options: { skip, take } });
        };

        this.administrators$ = administratorsQuery.stream$.pipe(map(data => data.administrators.items));
        this.totalItems$ = administratorsQuery.stream$.pipe(map(data => data.administrators.totalItems));
        this.currentPage$ = this.route.queryParamMap.pipe(
            map(qpm => qpm.get('page')),
            map(page => (!page ? 1 : +page)),
        );
        this.itemsPerPage$ = this.route.queryParamMap.pipe(
            map(qpm => qpm.get('perPage')),
            map(perPage => (!perPage ? 10 : +perPage)),
        );

        combineLatest(this.currentPage$, this.itemsPerPage$)
            .pipe(takeUntil(this.destroy$))
            .subscribe(fetchPage);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    setPageNumber(page: number) {
        this.setQueryParam('page', page);
    }

    setItemsPerPage(perPage: number) {
        this.setQueryParam('perPage', perPage);
    }

    private setQueryParam(key: string, value: any) {
        this.router.navigate(['./'], {
            queryParams: { [key]: value },
            relativeTo: this.route,
            queryParamsHandling: 'merge',
        });
    }
}
