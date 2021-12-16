import { Directive, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, QueryParamsHandling, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, shareReplay, takeUntil } from 'rxjs/operators';

import { QueryResult } from '../data/query-result';

export type ListQueryFn<R> = (take: number, skip: number, ...args: any[]) => QueryResult<R, any>;
export type MappingFn<T, R> = (result: R) => { items: T[]; totalItems: number };
export type OnPageChangeFn<V> = (skip: number, take: number) => V;

/**
 * @description
 * This is a base class which implements the logic required to fetch and manipulate
 * a list of data from a query which returns a PaginatedList type.
 *
 * @example
 * ```TypeScript
 * \@Component({
 *   selector: 'my-entity-list',
 *   templateUrl: './my-entity-list.component.html',
 *   styleUrls: ['./my-entity-list.component.scss'],
 *   changeDetection: ChangeDetectionStrategy.OnPush,
 * })
 * export class MyEntityListComponent extends BaseListComponent<GetMyEntityList.Query, GetMyEntityList.Items> {
 *   constructor(
 *     private dataService: DataService,
 *     router: Router,
 *     route: ActivatedRoute,
 *   ) {
 *     super(router, route);
 *     super.setQueryFn(
 *       (...args: any[]) => this.dataService.query<GetMyEntityList.Query>(GET_MY_ENTITY_LIST),
 *       data => data.myEntities,
 *     );
 *   }
 * }
 * ```
 *
 * The template for the component will typically use the {@link DataTableComponent} to display the results.
 *
 * @example
 * ```HTML
 * <vdr-action-bar>
 *   <vdr-ab-right>
 *     <a class="btn btn-primary" [routerLink]="['./create']" *vdrIfPermissions="['CreateSettings', 'CreateTaxRate']">
 *       <clr-icon shape="plus"></clr-icon>
 *       Create new my entity
 *     </a>
 *   </vdr-ab-right>
 * </vdr-action-bar>
 *
 * <vdr-data-table
 *   [items]="items$ | async"
 *   [itemsPerPage]="itemsPerPage$ | async"
 *   [totalItems]="totalItems$ | async"
 *   [currentPage]="currentPage$ | async"
 *   (pageChange)="setPageNumber($event)"
 *   (itemsPerPageChange)="setItemsPerPage($event)"
 * >
 *   <vdr-dt-column>{{ 'common.name' | translate }}</vdr-dt-column>
 *   <vdr-dt-column></vdr-dt-column>
 *   <ng-template let-myEntity="item">
 *     <td class="left align-middle">{{ myEntity.name }}</td>
 *     <td class="right align-middle">
 *       <vdr-table-row-action
 *         iconShape="edit"
 *         [label]="'common.edit' | translate"
 *         [linkTo]="['./', myEntity.id]"
 *       ></vdr-table-row-action>
 *     </td>
 *   </ng-template>
 * </vdr-data-table>
 * ```
 *
 * @docsCategory list-detail-views
 */
@Directive()
// tslint:disable-next-line:directive-class-suffix
export class BaseListComponent<ResultType, ItemType, VariableType = any> implements OnInit, OnDestroy {
    result$: Observable<ResultType>;
    items$: Observable<ItemType[]>;
    totalItems$: Observable<number>;
    itemsPerPage$: Observable<number>;
    currentPage$: Observable<number>;
    protected destroy$ = new Subject<void>();
    private listQuery: QueryResult<ResultType, VariableType>;
    private listQueryFn: ListQueryFn<ResultType>;
    private mappingFn: MappingFn<ItemType, ResultType>;
    private onPageChangeFn: OnPageChangeFn<VariableType> = (skip, take) =>
        ({ options: { skip, take } } as any);
    private refresh$ = new BehaviorSubject<undefined>(undefined);
    private defaults: { take: number; skip: number } = { take: 10, skip: 0 };

    constructor(protected router: Router, protected route: ActivatedRoute) {}

    /**
     * @description
     * Sets the fetch function for the list being implemented.
     */
    setQueryFn(
        listQueryFn: ListQueryFn<ResultType>,
        mappingFn: MappingFn<ItemType, ResultType>,
        onPageChangeFn?: OnPageChangeFn<VariableType>,
        defaults?: { take: number; skip: number },
    ) {
        this.listQueryFn = listQueryFn;
        this.mappingFn = mappingFn;
        if (onPageChangeFn) {
            this.onPageChangeFn = onPageChangeFn;
        }
        if (defaults) {
            this.defaults = defaults;
        }
    }

    /** @internal */
    ngOnInit() {
        if (!this.listQueryFn) {
            throw new Error(
                `No listQueryFn has been defined. Please call super.setQueryFn() in the constructor.`,
            );
        }
        this.listQuery = this.listQueryFn(this.defaults.take, this.defaults.skip);

        const fetchPage = ([currentPage, itemsPerPage, _]: [number, number, undefined]) => {
            const take = itemsPerPage;
            const skip = (currentPage - 1) * itemsPerPage;
            this.listQuery.ref.refetch(this.onPageChangeFn(skip, take));
        };

        this.result$ = this.listQuery.stream$.pipe(shareReplay(1));
        this.items$ = this.result$.pipe(map(data => this.mappingFn(data).items));
        this.totalItems$ = this.result$.pipe(map(data => this.mappingFn(data).totalItems));
        this.currentPage$ = this.route.queryParamMap.pipe(
            map(qpm => qpm.get('page')),
            map(page => (!page ? 1 : +page)),
            distinctUntilChanged(),
        );
        this.itemsPerPage$ = this.route.queryParamMap.pipe(
            map(qpm => qpm.get('perPage')),
            map(perPage => (!perPage ? this.defaults.take : +perPage)),
            distinctUntilChanged(),
        );

        combineLatest(this.currentPage$, this.itemsPerPage$, this.refresh$)
            .pipe(takeUntil(this.destroy$))
            .subscribe(fetchPage);
    }

    /** @internal */
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.listQuery.completed$.next();
    }

    /**
     * @description
     * Sets the current page number in the url.
     */
    setPageNumber(page: number) {
        this.setQueryParam('page', page, { replaceUrl: true });
    }

    /**
     * @description
     * Sets the number of items per page in the url.
     */
    setItemsPerPage(perPage: number) {
        this.setQueryParam('perPage', perPage, { replaceUrl: true });
    }

    /**
     * @description
     * Re-fetch the current page of results.
     */
    refresh() {
        this.refresh$.next(undefined);
    }

    protected setQueryParam(
        hash: { [key: string]: any },
        options?: { replaceUrl?: boolean; queryParamsHandling?: QueryParamsHandling },
    );
    protected setQueryParam(
        key: string,
        value: any,
        options?: { replaceUrl?: boolean; queryParamsHandling?: QueryParamsHandling },
    );
    protected setQueryParam(
        keyOrHash: string | { [key: string]: any },
        valueOrOptions?: any,
        maybeOptions?: { replaceUrl?: boolean; queryParamsHandling?: QueryParamsHandling },
    ) {
        const paramsObject = typeof keyOrHash === 'string' ? { [keyOrHash]: valueOrOptions } : keyOrHash;
        const options = (typeof keyOrHash === 'string' ? maybeOptions : valueOrOptions) ?? {};
        this.router.navigate(['./'], {
            queryParams: typeof keyOrHash === 'string' ? { [keyOrHash]: valueOrOptions } : keyOrHash,
            relativeTo: this.route,
            queryParamsHandling: 'merge',
            ...options,
        });
    }
}
