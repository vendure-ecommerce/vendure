import { OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { QueryResult } from '../data/query-result';

export type ListQueryFn<R> = (take: number, skip: number, ...args: any[]) => QueryResult<R, any>;
export type MappingFn<T, R> = (result: R) => { items: T[]; totalItems: number };

/**
 * This is a base class which implements the logic required to fetch and manipluate
 * a list of data from a query which returns a PaginatedList type.
 */
export class BaseListComponent<ResultType, ItemType> implements OnInit, OnDestroy {
    items$: Observable<ItemType[]>;
    totalItems$: Observable<number>;
    itemsPerPage$: Observable<number>;
    currentPage$: Observable<number>;
    private destroy$ = new Subject<void>();
    private listQueryFn: ListQueryFn<ResultType>;
    private mappingFn: MappingFn<ItemType, ResultType>;
    private refresh$ = new BehaviorSubject<undefined>(undefined);

    constructor(private router: Router, private route: ActivatedRoute) {}

    /**
     * Sets the fetch function for the list being implemented.
     */
    setQueryFn(listQueryFn: ListQueryFn<ResultType>, mappingFn: MappingFn<ItemType, ResultType>) {
        this.listQueryFn = listQueryFn;
        this.mappingFn = mappingFn;
    }

    ngOnInit() {
        if (!this.listQueryFn) {
            throw new Error(
                `No listQueryFn has been defined. Please call super.setQueryFn() in the constructor.`,
            );
        }
        const listQuery = this.listQueryFn(10, 0);

        const fetchPage = ([currentPage, itemsPerPage, _]: [number, number, undefined]) => {
            const take = itemsPerPage;
            const skip = (currentPage - 1) * itemsPerPage;
            listQuery.ref.refetch({ options: { skip, take } });
        };

        this.items$ = listQuery.stream$.pipe(map(data => this.mappingFn(data).items));
        this.totalItems$ = listQuery.stream$.pipe(map(data => this.mappingFn(data).totalItems));
        this.currentPage$ = this.route.queryParamMap.pipe(
            map(qpm => qpm.get('page')),
            map(page => (!page ? 1 : +page)),
        );
        this.itemsPerPage$ = this.route.queryParamMap.pipe(
            map(qpm => qpm.get('perPage')),
            map(perPage => (!perPage ? 10 : +perPage)),
        );

        combineLatest(this.currentPage$, this.itemsPerPage$, this.refresh$)
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

    /**
     * Re-fetch the current page
     */
    refresh() {
        this.refresh$.next(undefined);
    }

    private setQueryParam(key: string, value: any) {
        this.router.navigate(['./'], {
            queryParams: { [key]: value },
            relativeTo: this.route,
            queryParamsHandling: 'merge',
        });
    }
}
