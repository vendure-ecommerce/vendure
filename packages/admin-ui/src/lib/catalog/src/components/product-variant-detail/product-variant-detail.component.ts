import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductDetailService } from '@vendure/admin-ui/catalog';
import {
    BaseDetailComponent,
    DataService,
    findTranslation,
    GetProductVariantDetailDocument,
    GetProductVariantDetailQuery,
    GlobalFlag,
    ItemOf,
    LanguageCode,
    ModalService,
    NotificationService,
    Permission,
    ServerConfigService,
    TaxCategoryFragment,
    TypedBaseDetailComponent,
    TypedBaseListComponent,
} from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { SelectedAssets } from '../product-detail2/product-detail.types';

export interface VariantFormValue {
    id: string;
    enabled: boolean;
    sku: string;
    name: string;
    price: number;
    priceWithTax: number;
    taxCategoryId: string;
    stockOnHand: number;
    useGlobalOutOfStockThreshold: boolean;
    outOfStockThreshold: number;
    trackInventory: GlobalFlag;
    facetValueIds: string[][];
    customFields?: any;
}

@Component({
    selector: 'vdr-product-variant-detail',
    templateUrl: './product-variant-detail.component.html',
    styleUrls: ['./product-variant-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariantDetailComponent
    extends TypedBaseDetailComponent<typeof GetProductVariantDetailDocument, 'productVariant'>
    implements OnInit
{
    public readonly updatePermissions = [Permission.UpdateCatalog, Permission.UpdateProduct];
    readonly customFields = this.getCustomFieldConfig('ProductVariant');
    detailForm = this.formBuilder.group<VariantFormValue>({
        id: '',
        enabled: false,
        sku: '',
        name: '',
        price: 0,
        priceWithTax: 0,
        taxCategoryId: '',
        stockOnHand: 0,
        useGlobalOutOfStockThreshold: true,
        outOfStockThreshold: 0,
        trackInventory: GlobalFlag.TRUE,
        facetValueIds: [],
        customFields: this.formBuilder.group(
            this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
        ),
    });
    assetChanges: SelectedAssets = {};
    taxCategories$: Observable<Array<ItemOf<GetProductVariantDetailQuery, 'taxCategories'>>>;
    stockLocations$: Observable<ItemOf<GetProductVariantDetailQuery, 'stockLocations'>>;
    channelPriceIncludesTax$: Observable<boolean>;

    constructor(
        route: ActivatedRoute,
        router: Router,
        serverConfigService: ServerConfigService,
        private productDetailService: ProductDetailService,
        private formBuilder: FormBuilder,
        private modalService: ModalService,
        private notificationService: NotificationService,
        protected dataService: DataService,
        private changeDetector: ChangeDetectorRef,
    ) {
        super(route, router, serverConfigService, dataService);
    }

    ngOnInit() {
        this.init();
        this.taxCategories$ = this.result$.pipe(map(data => data.taxCategories.items));
        this.channelPriceIncludesTax$ = this.dataService.settings
            .getActiveChannel('cache-first')
            .refetchOnChannelChange()
            .mapStream(data => data.activeChannel.pricesIncludeTax)
            .pipe(shareReplay(1));
    }

    save() {
        /**/
    }

    assetsChanged(): boolean {
        return false;
    }

    protected setFormValues(
        variant: NonNullable<GetProductVariantDetailQuery['productVariant']>,
        languageCode: LanguageCode,
    ): void {
        const variantTranslation = findTranslation(variant, languageCode);
        const facetValueIds = variant.facetValues.map(fv => fv.id);
        this.detailForm.patchValue({
            id: variant.id,
            enabled: variant.enabled,
            sku: variant.sku,
            name: variantTranslation ? variantTranslation.name : '',
            price: variant.price,
            priceWithTax: variant.priceWithTax,
            taxCategoryId: variant.taxCategory.id,
            stockOnHand: variant.stockLevels[0].stockOnHand,
            useGlobalOutOfStockThreshold: variant.useGlobalOutOfStockThreshold,
            outOfStockThreshold: variant.outOfStockThreshold,
            trackInventory: variant.trackInventory,
            facetValueIds,
        });

        if (this.customFields.length) {
            this.setCustomFieldFormValues(
                this.customFields,
                this.detailForm.get('customFields'),
                variant,
                variantTranslation,
            );
        }
    }
}
