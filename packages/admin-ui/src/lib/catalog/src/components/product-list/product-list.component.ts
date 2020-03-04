import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { JobState, SearchInput, SearchProducts } from '@vendure/admin-ui/core';
import { BaseListComponent } from '@vendure/admin-ui/core';
import { JobQueueService } from '@vendure/admin-ui/core';
import { NotificationService } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';
import { ModalService } from '@vendure/admin-ui/core';
import { EMPTY, Observable, of } from 'rxjs';
import { delay, map, switchMap, take, takeUntil, withLatestFrom } from 'rxjs/operators';

import { ProductSearchInputComponent } from '../product-search-input/product-search-input.component';

@Component({
    selector: 'vdr-products-list',
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent
    extends BaseListComponent<SearchProducts.Query, SearchProducts.Items, SearchProducts.Variables>
    implements OnInit {
    searchTerm = '';
    facetValueIds: string[] = [];
    groupByProduct = true;
    facetValues$: Observable<SearchProducts.FacetValues[]>;
    @ViewChild('productSearchInputComponent', { static: true })
    private productSearchInput: ProductSearchInputComponent;
    constructor(
        private dataService: DataService,
        private modalService: ModalService,
        private notificationService: NotificationService,
        private jobQueueService: JobQueueService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
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
                    groupByProduct: this.groupByProduct,
                } as SearchInput,
            }),
        );
    }

    ngOnInit() {
        super.ngOnInit();
        this.facetValues$ = this.result$.pipe(map(data => data.search.facetValues));
        // this.facetValues$ = of([]);
        this.route.queryParamMap
            .pipe(
                map(qpm => qpm.get('q')),
                takeUntil(this.destroy$),
            )
            .subscribe(term => {
                this.productSearchInput.setSearchTerm(term);
            });

        const fvids$ = this.route.queryParamMap.pipe(map(qpm => qpm.getAll('fvids')));

        fvids$.pipe(takeUntil(this.destroy$)).subscribe(ids => {
            this.productSearchInput.setFacetValues(ids);
        });

        this.facetValues$
            .pipe(
                take(1),
                delay(100),
                withLatestFrom(fvids$),
            )
            .subscribe(([__, ids]) => {
                this.productSearchInput.setFacetValues(ids);
            });
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
}
