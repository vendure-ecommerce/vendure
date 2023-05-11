import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    GetProductListQuery,
    GetProductListQueryVariables,
    ItemOf,
    JobQueueService,
    JobState,
    LanguageCode,
    ModalService,
    NotificationService,
    ProductFilterParameter,
    ProductSearchInputComponent,
    ProductSortParameter,
    SearchProductsQuery,
    SelectionManager,
    ServerConfigService,
} from '@vendure/admin-ui/core';
import { EMPTY, Observable } from 'rxjs';
import { delay, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { DataTableService } from '../../../../core/src/providers/data-table/data-table.service';

export type SearchItem = ItemOf<SearchProductsQuery, 'search'>;

@Component({
    selector: 'vdr-products-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent
    extends BaseListComponent<
        GetProductListQuery,
        ItemOf<GetProductListQuery, 'products'>,
        GetProductListQueryVariables
    >
    implements OnInit, AfterViewInit
{
    searchTerm = '';
    facetValueIds: string[] = [];
    groupByProduct = true;
    selectedFacetValueIds$: Observable<string[]>;
    facetValues$: Observable<SearchProductsQuery['search']['facetValues']>;
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;
    pendingSearchIndexUpdates = 0;
    selectionManager = new SelectionManager<SearchItem>({
        multiSelect: true,
        itemsAreEqual: (a, b) =>
            this.groupByProduct ? a.productId === b.productId : a.productVariantId === b.productVariantId,
        additiveMode: true,
    });
    readonly filters = this.dataTableService
        .createFilterCollection<ProductFilterParameter>()
        .addDateFilters()
        .addFilter({
            name: 'id',
            type: { kind: 'text' },
            label: _('common.id'),
            filterField: 'id',
        })
        .addFilter({
            name: 'enabled',
            type: { kind: 'boolean' },
            label: _('common.enabled'),
            filterField: 'enabled',
        })
        .addFilter({
            name: 'slug',
            type: { kind: 'text' },
            label: _('common.slug'),
            filterField: 'slug',
        })
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<ProductSortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'id' })
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'name' })
        .addSort({ name: 'slug' })
        .connectToRoute(this.route);

    @ViewChild('productSearchInputComponent', { static: true })
    private productSearchInput: ProductSearchInputComponent;

    constructor(
        private dataService: DataService,
        private modalService: ModalService,
        private notificationService: NotificationService,
        private jobQueueService: JobQueueService,
        private serverConfigService: ServerConfigService,
        private dataTableService: DataTableService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        this.route.queryParamMap
            .pipe(
                map(qpm => qpm.get('q')),
                takeUntil(this.destroy$),
            )
            .subscribe(term => {
                this.searchTerm = term || '';
                if (this.productSearchInput) {
                    this.productSearchInput.setSearchTerm(term);
                }
            });
        this.selectedFacetValueIds$ = this.route.queryParamMap.pipe(map(qpm => qpm.getAll('fvids')));

        this.selectedFacetValueIds$.pipe(takeUntil(this.destroy$)).subscribe(ids => {
            this.facetValueIds = ids;
            if (this.productSearchInput) {
                this.productSearchInput.setFacetValues(ids);
            }
        });
        super.setQueryFn(
            (args: any) => this.dataService.product.getProducts(args).refetchOnChannelChange(),
            data => data.products,
            // eslint-disable-next-line @typescript-eslint/no-shadow
            (skip, take) => ({
                options: {
                    skip,
                    take,
                    filter: {
                        name: {
                            contains: this.searchTermControl.value,
                        },
                        ...this.filters.createFilterInput(),
                    },
                    sort: this.sorts.createSortInput(),
                },
            }),
        );
    }

    ngOnInit() {
        super.ngOnInit();

        // this.facetValues$ = this.result$.pipe(map(data => data.search.facetValues));
        //
        // this.facetValues$
        //     .pipe(take(1), delay(100), withLatestFrom(this.selectedFacetValueIds$))
        //     .subscribe(([__, ids]) => {
        //         this.productSearchInput.setFacetValues(ids);
        //     });
        this.availableLanguages$ = this.serverConfigService.getAvailableLanguages();
        this.contentLanguage$ = this.dataService.client
            .uiState()
            .mapStream(({ uiState }) => uiState.contentLanguage)
            .pipe(tap(() => this.refresh()));

        this.dataService.product
            .getPendingSearchIndexUpdates()
            .mapSingle(({ pendingSearchIndexUpdates }) => pendingSearchIndexUpdates)
            .subscribe(value => (this.pendingSearchIndexUpdates = value));

        super.refreshListOnChanges(this.contentLanguage$, this.filters.valueChanges, this.sorts.valueChanges);
    }

    ngAfterViewInit() {
        if (this.productSearchInput && this.searchTerm) {
            setTimeout(() => this.productSearchInput.setSearchTerm(this.searchTerm));
        }
    }

    setSearchTerm(term: string) {
        this.searchTerm = term;
        this.setQueryParam({ q: term || null, page: 1 });
        this.refresh();
    }

    setFacetValueIds(ids: string[]) {
        this.facetValueIds = ids;
        this.setQueryParam({ fvids: ids, page: 1 });
        this.refresh();
    }

    rebuildSearchIndex() {
        this.dataService.product.reindex().subscribe(({ reindex }) => {
            this.notificationService.info(_('catalog.reindexing'));
            this.jobQueueService.addJob(reindex.id, job => {
                if (job.state === JobState.COMPLETED) {
                    const time = new Intl.NumberFormat().format(job.duration || 0);
                    this.notificationService.success(_('catalog.reindex-successful'), {
                        count: job.result.indexedItemCount,
                        time,
                    });
                    this.refresh();
                } else {
                    this.notificationService.error(_('catalog.reindex-error'));
                }
            });
        });
    }

    runPendingSearchIndexUpdates() {
        this.dataService.product.runPendingSearchIndexUpdates().subscribe(value => {
            this.notificationService.info(_('catalog.running-search-index-updates'), {
                count: this.pendingSearchIndexUpdates,
            });
            this.pendingSearchIndexUpdates = 0;
        });
    }

    deleteProduct(productId: string) {
        this.modalService
            .dialog({
                title: _('catalog.confirm-delete-product'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(response => (response ? this.dataService.product.deleteProduct(productId) : EMPTY)),
                // Short delay to allow the product to be removed from the search index before
                // refreshing.
                delay(500),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'Product',
                    });
                    this.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Product',
                    });
                },
            );
    }

    setLanguage(code: LanguageCode) {
        this.dataService.client.setContentLanguage(code).subscribe();
    }
}
