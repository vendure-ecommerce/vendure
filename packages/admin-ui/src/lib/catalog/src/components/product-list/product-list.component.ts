import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    DataTableService,
    FacetValueFormInputComponent,
    GetProductListQuery,
    GetProductListQueryVariables,
    ItemOf,
    JobQueueService,
    JobState,
    LanguageCode,
    ModalService,
    NotificationService,
    ProductFilterParameter,
    ProductSortParameter,
    ServerConfigService,
} from '@vendure/admin-ui/core';
import { EMPTY, lastValueFrom, Observable } from 'rxjs';
import { delay, switchMap, tap } from 'rxjs/operators';

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
    implements OnInit
{
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;
    pendingSearchIndexUpdates = 0;
    readonly customFields = this.serverConfigService.getCustomFieldsFor('Product');

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
        .addFilter({
            name: 'facetValues',
            type: {
                kind: 'custom',
                component: FacetValueFormInputComponent,
                serializeValue: value => value.map(v => v.id).join(','),
                deserializeValue: value => value.split(',').map(id => ({ id })),
                getLabel: value => {
                    if (value.length === 0) {
                        return '';
                    }
                    if (value[0].name) {
                        return value.map(v => v.name).join(', ');
                    } else {
                        return lastValueFrom(
                            this.dataService.facet
                                .getFacetValues({ filter: { id: { in: value.map(v => v.id) } } })
                                .mapSingle(({ facetValues }) =>
                                    facetValues.items.map(fv => fv.name).join(', '),
                                ),
                        );
                    }
                },
            },
            label: _('catalog.facet-values'),
            toFilterInput: (value: any[]) => ({
                facetValueId: {
                    in: value.map(v => v.id),
                },
            }),
        })
        .addCustomFieldFilters(this.customFields)
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<ProductSortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'id' })
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'name' })
        .addSort({ name: 'slug' })
        .addCustomFieldSorts(this.customFields)
        .connectToRoute(this.route);

    constructor(
        private dataService: DataService,
        private modalService: ModalService,
        private notificationService: NotificationService,
        private jobQueueService: JobQueueService,
        private dataTableService: DataTableService,
        private serverConfigService: ServerConfigService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
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
