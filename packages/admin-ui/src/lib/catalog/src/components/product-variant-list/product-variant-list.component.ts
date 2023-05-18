import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseListComponent,
    DataService,
    GetProductVariantListQuery,
    GetProductVariantListQueryVariables,
    ItemOf,
    JobQueueService,
    LanguageCode,
    ModalService,
    NavBuilderService,
    NotificationService,
    ProductFilterParameter,
    ProductSortParameter,
    ProductVariantFilterParameter,
    ProductVariantSortParameter,
    ServerConfigService,
} from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { DataTableService } from '../../../../core/src/providers/data-table/data-table.service';

@Component({
    selector: 'vdr-product-variant-list',
    templateUrl: './product-variant-list.component.html',
    styleUrls: ['./product-variant-list.component.scss'],
})
export class ProductVariantListComponent
    extends BaseListComponent<
        GetProductVariantListQuery,
        ItemOf<GetProductVariantListQuery, 'productVariants'>,
        GetProductVariantListQueryVariables
    >
    implements OnInit
{
    @Input() productId?: string;
    @Input() hideLanguageSelect = false;
    availableLanguages$: Observable<LanguageCode[]>;
    contentLanguage$: Observable<LanguageCode>;
    readonly filters = this.dataTableService
        .createFilterCollection<ProductVariantFilterParameter>()
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
            name: 'sku',
            type: { kind: 'text' },
            label: _('catalog.sku'),
            filterField: 'sku',
        })
        .addFilter({
            name: 'price',
            type: { kind: 'number', inputType: 'currency' },
            label: _('common.price'),
            filterField: 'price',
        })
        .addFilter({
            name: 'priceWithTax',
            type: { kind: 'number', inputType: 'currency' },
            label: _('common.price-with-tax'),
            filterField: 'priceWithTax',
        })
        .connectToRoute(this.route);

    readonly sorts = this.dataTableService
        .createSortCollection<ProductVariantSortParameter>()
        .defaultSort('createdAt', 'DESC')
        .addSort({ name: 'id' })
        .addSort({ name: 'createdAt' })
        .addSort({ name: 'updatedAt' })
        .addSort({ name: 'name' })
        .addSort({ name: 'sku' })
        .addSort({ name: 'price' })
        .addSort({ name: 'priceWithTax' })
        .connectToRoute(this.route);

    constructor(
        private dataService: DataService,
        private modalService: ModalService,
        private notificationService: NotificationService,
        private jobQueueService: JobQueueService,
        private serverConfigService: ServerConfigService,
        private dataTableService: DataTableService,
        private navBuilderService: NavBuilderService,
        router: Router,
        route: ActivatedRoute,
    ) {
        super(router, route);
        super.setQueryFn(
            (args: any) => this.dataService.product.getProductVariants(args).refetchOnChannelChange(),
            data => data.productVariants,
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
                        ...(this.productId ? { productId: { eq: this.productId } } : {}),
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
        super.refreshListOnChanges(this.contentLanguage$, this.filters.valueChanges, this.sorts.valueChanges);
    }

    setLanguage(code: LanguageCode) {
        this.dataService.client.setContentLanguage(code).subscribe();
    }
}
