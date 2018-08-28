import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { GetFacetList_facets_items } from 'shared/generated-types';

import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-facet-list',
    templateUrl: './facet-list.component.html',
    styleUrls: ['./facet-list.component.scss'],
})
export class FacetListComponent implements OnInit, OnDestroy {
    facets$: Observable<GetFacetList_facets_items[]>;
    totalItems$: Observable<number>;
    itemsPerPage$: Observable<number>;
    currentPage$: Observable<number>;
    private destroy$ = new Subject<void>();

    constructor(private dataService: DataService, private router: Router, private route: ActivatedRoute) {}

    ngOnInit() {
        const facetsQuery = this.dataService.facet.getFacets(10, 0);

        const fetchPage = ([currentPage, itemsPerPage]: [number, number]) => {
            const take = itemsPerPage;
            const skip = (currentPage - 1) * itemsPerPage;
            facetsQuery.ref.refetch({ options: { skip, take } });
        };

        this.facets$ = facetsQuery.stream$.pipe(map(data => data.facets.items));
        this.totalItems$ = facetsQuery.stream$.pipe(map(data => data.facets.totalItems));
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
