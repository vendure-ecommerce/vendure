import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    JobQueueService,
    JobState,
    LanguageCode,
    LogicalOperator,
    ModalService,
    NotificationService,
    SearchInput,
    SearchProducts,
    ServerConfigService,
} from '@vendure/admin-ui/core';
import { EMPTY, Observable, of } from 'rxjs';
import {
    delay,
    distinctUntilChanged,
    map,
    shareReplay,
    switchMap,
    take,
    takeUntil,
    tap,
    withLatestFrom,
} from 'rxjs/operators';

import { ProductSearchInputComponent } from '../product-search-input/product-search-input.component';

@Component({
    selector: 'vdr-products-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent
    extends BaseListComponent<SearchProducts.Query, SearchProducts.Items, SearchProducts.Variables>
    implements OnInit, AfterViewInit
{
    searchTerm = '';
    facetValueIds: string[] = [];
    groupByProduct = true;
    selectedFacetValueIds$: Observable<string[]>;
    facetValues$: Observable<SearchProducts.FacetValues[]>;
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;
    @ViewChild('productSearchInputComponent', { static: true })
    private productSearchInput: ProductSearchInputComponent;
    constructor(
        private dataService: DataService,
        private modalService: ModalService,
        private notificationService: NotificationService,
        private jobQueueService: JobQueueService,
        private serverConfigService: ServerConfigService,
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
            (...args: any[]) =>
                this.dataService.product.searchProducts(this.searchTerm, ...args).refetchOnChannelChange(),
            data => data.search,
            // tslint:disable-next-line:no-shadowed-variable
            (skip, take) => ({
                input: {
                    skip,
                    take,
                    term: this.searchTerm,
                    facetValueIds: this.facetValueIds,
                    facetValueOperator: LogicalOperator.AND,
                    groupByProduct: this.groupByProduct,
                } as SearchInput,
            }),
        );
    }

    ngOnInit() {
        super.ngOnInit();

        this.facetValues$ = this.result$.pipe(map(data => data.search.facetValues));

        this.facetValues$
            .pipe(take(1), delay(100), withLatestFrom(this.selectedFacetValueIds$))
            .subscribe(([__, ids]) => {
                this.productSearchInput.setFacetValues(ids);
            });
        this.availableLanguages$ = this.serverConfigService.getAvailableLanguages();
        this.contentLanguage$ = this.dataService.client
            .uiState()
            .mapStream(({ uiState }) => uiState.contentLanguage)
            .pipe(tap(() => this.refresh()));
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
