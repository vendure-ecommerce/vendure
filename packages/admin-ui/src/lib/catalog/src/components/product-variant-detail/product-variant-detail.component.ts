import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    Asset,
    CreateProductVariantInput,
    createUpdatedTranslatable,
    DataService,
    findTranslation,
    GlobalFlag,
    ItemOf,
    LanguageCode,
    ModalService,
    NotificationService,
    Permission,
    ProductOptionFragment,
    ProductVariantDetailQueryDocument,
    ProductVariantDetailQueryQuery,
    ProductVariantFragment,
    ProductVariantUpdateMutationDocument,
    ServerConfigService,
    TypedBaseDetailComponent,
    UpdateProductVariantInput,
} from '@vendure/admin-ui/core';
import { pick } from '@vendure/common/lib/pick';
import { unique } from '@vendure/common/lib/unique';
import { combineLatest, concat, Observable } from 'rxjs';
import {
    distinctUntilChanged,
    map,
    mergeMap,
    shareReplay,
    skip,
    switchMap,
    switchMapTo,
    take,
    tap,
} from 'rxjs/operators';
import { ProductDetailService } from '../../providers/product-detail/product-detail.service';
import { ApplyFacetDialogComponent } from '../apply-facet-dialog/apply-facet-dialog.component';

interface SelectedAssets {
    assets?: Asset[];
    featuredAsset?: Asset;
}

interface VariantFormValue {
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
type T = NonNullable<ProductVariantDetailQueryQuery['productVariant']>;
type T1 = T['stockLevels'];
@Component({
    selector: 'vdr-product-variant-detail',
    templateUrl: './product-variant-detail.component.html',
    styleUrls: ['./product-variant-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariantDetailComponent
    extends TypedBaseDetailComponent<typeof ProductVariantDetailQueryDocument, 'productVariant'>
    implements OnInit, OnDestroy
{
    public readonly updatePermissions = [Permission.UpdateCatalog, Permission.UpdateProduct];
    readonly customFields = this.getCustomFieldConfig('ProductVariant');
    stockLevels$: Observable<NonNullable<ProductVariantDetailQueryQuery['productVariant']>['stockLevels']>;
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
    stockLevelsForm = this.formBuilder.array<
        FormGroup<{
            stockLocationId: FormControl<string | null>;
            stockLocationName: FormControl<string | null>;
            stockOnHand: FormControl<number | null>;
            stockAllocated: FormControl<number | null>;
        }>
    >([]);
    assetChanges: SelectedAssets = {};
    taxCategories$: Observable<Array<ItemOf<ProductVariantDetailQueryQuery, 'taxCategories'>>>;
    stockLocations$: Observable<ItemOf<ProductVariantDetailQueryQuery, 'stockLocations'>>;
    channelPriceIncludesTax$: Observable<boolean>;
    readonly GlobalFlag = GlobalFlag;
    globalTrackInventory: boolean;
    globalOutOfStockThreshold: number;
    facetValues$: Observable<NonNullable<ProductVariantDetailQueryQuery['productVariant']>['facetValues']>;

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
        this.dataService.settings.getGlobalSettings('cache-first').single$.subscribe(({ globalSettings }) => {
            this.globalTrackInventory = globalSettings.trackInventory;
            this.globalOutOfStockThreshold = globalSettings.outOfStockThreshold;
            this.changeDetector.markForCheck();
        });
        this.taxCategories$ = this.result$.pipe(map(data => data.taxCategories.items));
        this.channelPriceIncludesTax$ = this.dataService.settings
            .getActiveChannel('cache-first')
            .refetchOnChannelChange()
            .mapStream(data => data.activeChannel.pricesIncludeTax)
            .pipe(shareReplay(1));
        this.stockLevels$ = this.entity$.pipe(map(entity => entity?.stockLevels ?? []));
        const facetValues$ = this.entity$.pipe(map(variant => variant.facetValues ?? []));
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const formFacetValueIdChanges$ = this.detailForm.get('facetValueIds')!.valueChanges.pipe(
            skip(1),
            distinctUntilChanged(),
            switchMap(ids =>
                this.dataService.facet
                    .getFacetValues({ filter: { id: { in: ids } } })
                    .mapSingle(({ facetValues }) => facetValues.items),
            ),
            shareReplay(1),
        );
        this.facetValues$ = concat(
            facetValues$.pipe(take(1)),
            facetValues$.pipe(switchMapTo(formFacetValueIdChanges$)),
        );
    }

    ngOnDestroy() {
        this.destroy();
    }

    save() {
        combineLatest(this.entity$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([variant, languageCode]) => {
                    const formValue = this.detailForm.value;
                    const input = pick(
                        this.getUpdatedVariant(
                            variant,
                            this.detailForm,
                            languageCode,
                        ) as UpdateProductVariantInput,
                        [
                            'id',
                            'enabled',
                            'translations',
                            'sku',
                            'price',
                            'taxCategoryId',
                            'facetValueIds',
                            'featuredAssetId',
                            'assetIds',
                            'trackInventory',
                            'outOfStockThreshold',
                            'useGlobalOutOfStockThreshold',
                            'stockOnHand',
                            'customFields',
                        ],
                    ) as UpdateProductVariantInput;
                    if (this.stockLevelsForm.dirty) {
                        const stockLevelsFormValue = this.stockLevelsForm.value;
                        input.stockLevels = this.stockLevelsForm.controls
                            .filter(control => control.dirty)
                            .map(control => ({
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                stockLocationId: control.value.stockLocationId!,
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                stockOnHand: control.value.stockOnHand!,
                            }));
                    }
                    return this.dataService.mutate(ProductVariantUpdateMutationDocument, {
                        input: [input],
                    });
                }),
            )
            .subscribe(
                result => {
                    this.detailForm.markAsPristine();
                    this.stockLevelsForm.markAsPristine();
                    this.assetChanges = {};
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'ProductVariant',
                    });
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'ProductVariant',
                    });
                },
            );
    }

    assetsChanged(): boolean {
        return false;
    }

    inventoryIsNotTracked(formGroup: UntypedFormGroup): boolean {
        const trackInventory = formGroup.get('trackInventory')?.value;
        return (
            trackInventory === GlobalFlag.FALSE ||
            (trackInventory === GlobalFlag.INHERIT && this.globalTrackInventory === false)
        );
    }

    optionGroupName(optionGroupId: string): string | undefined {
        const group = this.entity?.product.optionGroups.find(g => g.id === optionGroupId);
        if (group) {
            const translation =
                group?.translations.find(t => t.languageCode === this.languageCode) ?? group.translations[0];
            return translation.name;
        }
    }

    optionName(option: ProductOptionFragment) {
        const translation =
            option.translations.find(t => t.languageCode === this.languageCode) ?? option.translations[0];
        return translation.name;
    }

    editOption(option: ProductVariantFragment['options'][number]) {
        /*     this.modalService
                .fromComponent(UpdateProductOptionDialogComponent, {
                    size: 'md',
                    locals: {
                        productOption: option,
                        activeLanguage: this.languageCode,
                        customFields: this.customOptionFields,
                    },
                })
                .subscribe(result => {
                    if (result) {
                        this.updateProductOption.emit(result);
                    }
                }); */
    }

    removeFacetValue(facetValueId: string) {
        const productGroup = this.detailForm;
        const currentFacetValueIds = productGroup.value.facetValueIds ?? [];
        productGroup.patchValue({
            facetValueIds: currentFacetValueIds.filter(id => id !== facetValueId),
        });
        productGroup.markAsDirty();
    }

    selectFacetValue() {
        this.displayFacetValueModal().subscribe(facetValueIds => {
            if (facetValueIds) {
                const currentFacetValueIds = this.detailForm.value.facetValueIds ?? [];
                this.detailForm.patchValue({
                    facetValueIds: unique([...currentFacetValueIds, ...facetValueIds]),
                });
                this.detailForm.markAsDirty();
            }
        });
    }

    private displayFacetValueModal(): Observable<string[] | undefined> {
        return this.modalService
            .fromComponent(ApplyFacetDialogComponent, {
                size: 'md',
                closable: true,
            })
            .pipe(map(facetValues => facetValues && facetValues.map(v => v.id)));
    }

    protected setFormValues(
        variant: NonNullable<ProductVariantDetailQueryQuery['productVariant']>,
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
            stockOnHand: variant.stockLevels[0]?.stockOnHand ?? 0,
            useGlobalOutOfStockThreshold: variant.useGlobalOutOfStockThreshold,
            outOfStockThreshold: variant.outOfStockThreshold,
            trackInventory: variant.trackInventory,
            facetValueIds,
        });
        this.stockLevelsForm.clear();
        for (const stockLevel of variant.stockLevels) {
            this.stockLevelsForm.push(
                this.formBuilder.group({
                    stockLocationId: stockLevel.stockLocation.id,
                    stockLocationName: stockLevel.stockLocation.name,
                    stockOnHand: stockLevel.stockOnHand,
                    stockAllocated: stockLevel.stockAllocated,
                }),
            );
        }
        if (this.customFields.length) {
            this.setCustomFieldFormValues(
                this.customFields,
                this.detailForm.get('customFields'),
                variant,
                variantTranslation,
            );
        }
    }

    /**
     * Given a product and the value of the detailForm, this method creates an updated copy of the product which
     * can then be persisted to the API.
     */
    private getUpdatedVariant(
        variant: NonNullable<ProductVariantDetailQueryQuery['productVariant']>,
        variantFormGroup: typeof this.detailForm,
        languageCode: LanguageCode,
    ): UpdateProductVariantInput | CreateProductVariantInput {
        const updatedProduct = createUpdatedTranslatable({
            translatable: variant,
            updatedFields: variantFormGroup.value,
            customFieldConfig: this.customFields,
            languageCode,
            defaultTranslation: {
                languageCode,
                name: variant.name || '',
            },
        });
        return {
            ...updatedProduct,
            assetIds: this.assetChanges.assets?.map(a => a.id),
            featuredAssetId: this.assetChanges.featuredAsset?.id,
            facetValueIds: variantFormGroup.value.facetValueIds,
        } as UpdateProductVariantInput | CreateProductVariantInput;
    }
}
