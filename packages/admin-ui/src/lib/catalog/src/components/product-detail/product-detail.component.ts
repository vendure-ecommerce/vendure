import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    Asset,
    BaseDetailComponent,
    CreateProductInput,
    createUpdatedTranslatable,
    CustomFieldConfig,
    DataService,
    findTranslation,
    getChannelCodeFromUserStatus,
    GetProductWithVariants,
    GlobalFlag,
    LanguageCode,
    LogicalOperator,
    ModalService,
    NotificationService,
    Permission,
    ProductDetail,
    ProductVariant,
    ProductVariantFragment,
    ServerConfigService,
    TaxCategory,
    unicodePatternValidator,
    UpdateProductInput,
    UpdateProductMutation,
    UpdateProductOptionInput,
    UpdateProductVariantInput,
    UpdateProductVariantsMutation,
} from '@vendure/admin-ui/core';
import { normalizeString } from '@vendure/common/lib/normalize-string';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { unique } from '@vendure/common/lib/unique';
import { BehaviorSubject, combineLatest, concat, EMPTY, from, merge, Observable } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    mergeMap,
    shareReplay,
    skip,
    skipUntil,
    startWith,
    switchMap,
    switchMapTo,
    take,
    takeUntil,
    tap,
} from 'rxjs/operators';

import { ProductDetailService } from '../../providers/product-detail/product-detail.service';
import { ApplyFacetDialogComponent } from '../apply-facet-dialog/apply-facet-dialog.component';
import { AssignProductsToChannelDialogComponent } from '../assign-products-to-channel-dialog/assign-products-to-channel-dialog.component';
import { CreateProductVariantsConfig } from '../generate-product-variants/generate-product-variants.component';
import { VariantAssetChange } from '../product-variants-list/product-variants-list.component';

export type TabName = 'details' | 'variants';

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
    facetValueIds: string[];
    customFields?: any;
}

export interface SelectedAssets {
    assets?: Asset[];
    featuredAsset?: Asset;
}

export interface PaginationConfig {
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
}

@Component({
    selector: 'vdr-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent
    extends BaseDetailComponent<GetProductWithVariants.Product>
    implements OnInit, OnDestroy
{
    activeTab$: Observable<TabName>;
    product$: Observable<GetProductWithVariants.Product>;
    variants$: Observable<ProductVariant.Fragment[]>;
    taxCategories$: Observable<TaxCategory.Fragment[]>;
    customFields: CustomFieldConfig[];
    customVariantFields: CustomFieldConfig[];
    customOptionGroupFields: CustomFieldConfig[];
    customOptionFields: CustomFieldConfig[];
    detailForm: FormGroup;
    filterInput = new FormControl('');
    assetChanges: SelectedAssets = {};
    variantAssetChanges: { [variantId: string]: SelectedAssets } = {};
    variantFacetValueChanges: { [variantId: string]: ProductVariantFragment['facetValues'] } = {};
    productChannels$: Observable<ProductDetail.Channels[]>;
    facetValues$: Observable<ProductDetail.FacetValues[]>;
    totalItems$: Observable<number>;
    currentPage$ = new BehaviorSubject(1);
    itemsPerPage$ = new BehaviorSubject(10);
    paginationConfig$: Observable<PaginationConfig>;
    selectedVariantIds: string[] = [];
    variantDisplayMode: 'card' | 'table' = 'card';
    createVariantsConfig: CreateProductVariantsConfig = { groups: [], variants: [] };
    channelPriceIncludesTax$: Observable<boolean>;
    // Used to store all ProductVariants which have been loaded.
    // It is needed when saving changes to variants.
    private productVariantMap = new Map<string, ProductVariant.Fragment>();
    public readonly updatePermissions = [Permission.UpdateCatalog, Permission.UpdateProduct];

    constructor(
        route: ActivatedRoute,
        router: Router,
        serverConfigService: ServerConfigService,
        private productDetailService: ProductDetailService,
        private formBuilder: FormBuilder,
        private modalService: ModalService,
        private notificationService: NotificationService,
        protected dataService: DataService,
        private location: Location,
        private changeDetector: ChangeDetectorRef,
    ) {
        super(route, router, serverConfigService, dataService);
        this.customFields = this.getCustomFieldConfig('Product');
        this.customVariantFields = this.getCustomFieldConfig('ProductVariant');
        this.customOptionGroupFields = this.getCustomFieldConfig('ProductOptionGroup');
        this.customOptionFields = this.getCustomFieldConfig('ProductOption');
        this.detailForm = this.formBuilder.group({
            product: this.formBuilder.group({
                enabled: true,
                name: ['', Validators.required],
                autoUpdateVariantNames: true,
                slug: ['', unicodePatternValidator(/^[\p{Letter}0-9_-]+$/)],
                description: '',
                facetValueIds: [[]],
                customFields: this.formBuilder.group(
                    this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
                ),
            }),
            variants: this.formBuilder.array([]),
        });
    }

    ngOnInit() {
        this.init();
        this.product$ = this.entity$;
        const filterTerm$ = this.filterInput.valueChanges.pipe(
            startWith(''),
            debounceTime(200),
            shareReplay(),
            tap(() => this.currentPage$.next(1)),
        );
        const initialVariants$ = this.product$.pipe(map(p => p.variantList.items));
        const variantsList$ = combineLatest(filterTerm$, this.currentPage$, this.itemsPerPage$).pipe(
            skipUntil(initialVariants$),
            skip(1),
            debounceTime(100),
            switchMap(([term, currentPage, itemsPerPage]) => {
                return this.dataService.product
                    .getProductVariants(
                        {
                            skip: (currentPage - 1) * itemsPerPage,
                            take: itemsPerPage,
                            ...(term
                                ? { filter: { name: { contains: term }, sku: { contains: term } } }
                                : {}),
                            filterOperator: LogicalOperator.OR,
                        },
                        this.id,
                    )
                    .mapStream(({ productVariants }) => productVariants);
            }),
            shareReplay({ bufferSize: 1, refCount: true }),
        );
        const updatedVariants$ = variantsList$.pipe(map(result => result.items));
        this.variants$ = merge(initialVariants$, updatedVariants$).pipe(
            tap(variants => {
                for (const variant of variants) {
                    this.productVariantMap.set(variant.id, variant);
                }
            }),
        );
        this.totalItems$ = merge(
            this.product$.pipe(map(product => product.variantList.totalItems)),
            variantsList$.pipe(map(result => result.totalItems)),
        );
        this.paginationConfig$ = combineLatest(this.totalItems$, this.itemsPerPage$, this.currentPage$).pipe(
            map(([totalItems, itemsPerPage, currentPage]) => ({
                totalItems,
                itemsPerPage,
                currentPage,
            })),
        );
        this.taxCategories$ = this.productDetailService.getTaxCategories().pipe(takeUntil(this.destroy$));
        this.activeTab$ = this.route.paramMap.pipe(map(qpm => qpm.get('tab') as any));

        combineLatest(updatedVariants$, this.languageCode$)
            .pipe(takeUntil(this.destroy$))
            .subscribe(([variants, languageCode]) => {
                this.buildVariantFormArray(variants, languageCode);
            });

        const productFacetValues$ = this.product$.pipe(map(product => product.facetValues));
        const productGroup = this.getProductFormGroup();
        // tslint:disable-next-line:no-non-null-assertion
        const formFacetValueIdChanges$ = productGroup.get('facetValueIds')!.valueChanges.pipe(
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
            productFacetValues$.pipe(take(1)),
            productFacetValues$.pipe(switchMapTo(formFacetValueIdChanges$)),
        );
        this.productChannels$ = this.product$.pipe(map(p => p.channels));
        this.channelPriceIncludesTax$ = this.dataService.settings
            .getActiveChannel('cache-first')
            .refetchOnChannelChange()
            .mapStream(data => data.activeChannel.pricesIncludeTax)
            .pipe(shareReplay(1));
    }

    ngOnDestroy() {
        this.destroy();
    }

    navigateToTab(tabName: TabName) {
        this.location.replaceState(
            this.router
                .createUrlTree(['./', { ...this.route.snapshot.params, tab: tabName }], {
                    queryParamsHandling: 'merge',
                    relativeTo: this.route,
                })
                .toString(),
        );
    }

    isDefaultChannel(channelCode: string): boolean {
        return channelCode === DEFAULT_CHANNEL_CODE;
    }

    setPage(page: number) {
        this.currentPage$.next(page);
    }

    setItemsPerPage(value: string) {
        this.itemsPerPage$.next(+value);
        this.currentPage$.next(1);
    }

    assignToChannel() {
        this.productChannels$
            .pipe(
                take(1),
                switchMap(channels => {
                    return this.modalService.fromComponent(AssignProductsToChannelDialogComponent, {
                        size: 'lg',
                        locals: {
                            productIds: [this.id],
                            currentChannelIds: channels.map(c => c.id),
                        },
                    });
                }),
            )
            .subscribe();
    }

    removeFromChannel(channelId: string) {
        from(getChannelCodeFromUserStatus(this.dataService, channelId))
            .pipe(
                switchMap(({ channelCode }) => {
                    return this.modalService.dialog({
                        title: _('catalog.remove-product-from-channel'),
                        buttons: [
                            { type: 'secondary', label: _('common.cancel') },
                            {
                                type: 'danger',
                                label: _('catalog.remove-from-channel'),
                                translationVars: { channelCode },
                                returnValue: true,
                            },
                        ],
                    });
                }),
                switchMap(response =>
                    response
                        ? this.dataService.product.removeProductsFromChannel({
                              channelId,
                              productIds: [this.id],
                          })
                        : EMPTY,
                ),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('catalog.notify-remove-product-from-channel-success'));
                },
                err => {
                    this.notificationService.error(_('catalog.notify-remove-product-from-channel-error'));
                },
            );
    }

    assignVariantToChannel(variant: ProductVariant.Fragment) {
        return this.modalService
            .fromComponent(AssignProductsToChannelDialogComponent, {
                size: 'lg',
                locals: {
                    productIds: [this.id],
                    productVariantIds: [variant.id],
                    currentChannelIds: variant.channels.map(c => c.id),
                },
            })
            .subscribe();
    }

    removeVariantFromChannel({
        channelId,
        variant,
    }: {
        channelId: string;
        variant: ProductVariant.Fragment;
    }) {
        from(getChannelCodeFromUserStatus(this.dataService, channelId))
            .pipe(
                switchMap(({ channelCode }) => {
                    return this.modalService.dialog({
                        title: _('catalog.remove-product-variant-from-channel'),
                        buttons: [
                            { type: 'secondary', label: _('common.cancel') },
                            {
                                type: 'danger',
                                label: _('catalog.remove-from-channel'),
                                translationVars: { channelCode },
                                returnValue: true,
                            },
                        ],
                    });
                }),
                switchMap(response =>
                    response
                        ? this.dataService.product.removeVariantsFromChannel({
                              channelId,
                              productVariantIds: [variant.id],
                          })
                        : EMPTY,
                ),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('catalog.notify-remove-variant-from-channel-success'));
                },
                err => {
                    this.notificationService.error(_('catalog.notify-remove-variant-from-channel-error'));
                },
            );
    }

    assetsChanged(): boolean {
        return !!Object.values(this.assetChanges).length;
    }

    variantAssetsChanged(): boolean {
        return !!Object.keys(this.variantAssetChanges).length;
    }

    variantAssetChange(event: VariantAssetChange) {
        this.variantAssetChanges[event.variantId] = event;
    }

    /**
     * If creating a new product, automatically generate the slug based on the product name.
     */
    updateSlug(nameValue: string) {
        combineLatest(this.entity$, this.languageCode$)
            .pipe(take(1))
            .subscribe(([entity, languageCode]) => {
                const slugControl = this.detailForm.get(['product', 'slug']);
                const currentTranslation = findTranslation(entity, languageCode);
                const currentSlugIsEmpty = !currentTranslation || !currentTranslation.slug;
                if (slugControl && slugControl.pristine && currentSlugIsEmpty) {
                    slugControl.setValue(normalizeString(`${nameValue}`, '-'));
                }
            });
    }

    selectProductFacetValue() {
        this.displayFacetValueModal().subscribe(facetValueIds => {
            if (facetValueIds) {
                const productGroup = this.getProductFormGroup();
                const currentFacetValueIds = productGroup.value.facetValueIds;
                productGroup.patchValue({
                    facetValueIds: unique([...currentFacetValueIds, ...facetValueIds]),
                });
                productGroup.markAsDirty();
            }
        });
    }

    updateProductOption(input: UpdateProductOptionInput & { autoUpdate: boolean }) {
        combineLatest(this.product$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([product, languageCode]) =>
                    this.productDetailService.updateProductOption(input, product, languageCode),
                ),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'ProductOption',
                    });
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'ProductOption',
                    });
                },
            );
    }

    removeProductFacetValue(facetValueId: string) {
        const productGroup = this.getProductFormGroup();
        const currentFacetValueIds = productGroup.value.facetValueIds;
        productGroup.patchValue({
            facetValueIds: currentFacetValueIds.filter(id => id !== facetValueId),
        });
        productGroup.markAsDirty();
    }

    variantsToCreateAreValid(): boolean {
        return (
            0 < this.createVariantsConfig.variants.length &&
            this.createVariantsConfig.variants.every(v => {
                return v.sku !== '';
            })
        );
    }

    private displayFacetValueModal(): Observable<string[] | undefined> {
        return this.modalService
            .fromComponent(ApplyFacetDialogComponent, {
                size: 'md',
                closable: true,
            })
            .pipe(map(facetValues => facetValues && facetValues.map(v => v.id)));
    }

    create() {
        const productGroup = this.getProductFormGroup();
        if (!productGroup.dirty) {
            return;
        }
        combineLatest(this.product$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([product, languageCode]) => {
                    const newProduct = this.getUpdatedProduct(
                        product,
                        productGroup as FormGroup,
                        languageCode,
                    ) as CreateProductInput;
                    return this.productDetailService.createProductWithVariants(
                        newProduct,
                        this.createVariantsConfig,
                        languageCode,
                    );
                }),
            )
            .subscribe(
                ({ createProductVariants, productId }) => {
                    this.notificationService.success(_('common.notify-create-success'), {
                        entity: 'Product',
                    });
                    this.assetChanges = {};
                    this.variantAssetChanges = {};
                    this.detailForm.markAsPristine();
                    this.router.navigate(['../', productId], { relativeTo: this.route });
                },
                err => {
                    // tslint:disable-next-line:no-console
                    console.error(err);
                    this.notificationService.error(_('common.notify-create-error'), {
                        entity: 'Product',
                    });
                },
            );
    }

    save() {
        combineLatest(this.product$, this.languageCode$, this.channelPriceIncludesTax$)
            .pipe(
                take(1),
                mergeMap(([product, languageCode, priceIncludesTax]) => {
                    const productGroup = this.getProductFormGroup();
                    let productInput: UpdateProductInput | undefined;
                    let variantsInput: UpdateProductVariantInput[] | undefined;

                    if (productGroup.dirty || this.assetsChanged()) {
                        productInput = this.getUpdatedProduct(
                            product,
                            productGroup as FormGroup,
                            languageCode,
                        ) as UpdateProductInput;
                    }
                    const variantsArray = this.detailForm.get('variants');
                    if ((variantsArray && variantsArray.dirty) || this.variantAssetsChanged()) {
                        variantsInput = this.getUpdatedProductVariants(
                            product,
                            variantsArray as FormArray,
                            languageCode,
                            priceIncludesTax,
                        );
                    }

                    return this.productDetailService.updateProduct({
                        product,
                        languageCode,
                        autoUpdate:
                            this.detailForm.get(['product', 'autoUpdateVariantNames'])?.value ?? false,
                        productInput,
                        variantsInput,
                    });
                }),
            )
            .subscribe(
                result => {
                    this.updateSlugAfterSave(result);
                    this.detailForm.markAsPristine();
                    this.assetChanges = {};
                    this.variantAssetChanges = {};
                    this.variantFacetValueChanges = {};
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'Product',
                    });
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Product',
                    });
                },
            );
    }

    canDeactivate(): boolean {
        return super.canDeactivate() && !this.assetChanges.assets && !this.assetChanges.featuredAsset;
    }

    /**
     * Sets the values of the form on changes to the product or current language.
     */
    protected setFormValues(product: GetProductWithVariants.Product, languageCode: LanguageCode) {
        const currentTranslation = findTranslation(product, languageCode);
        this.detailForm.patchValue({
            product: {
                enabled: product.enabled,
                name: currentTranslation ? currentTranslation.name : '',
                slug: currentTranslation ? currentTranslation.slug : '',
                description: currentTranslation ? currentTranslation.description : '',
                facetValueIds: product.facetValues.map(fv => fv.id),
            },
        });

        if (this.customFields.length) {
            this.setCustomFieldFormValues(
                this.customFields,
                this.detailForm.get(['product', 'customFields']),
                product,
                currentTranslation,
            );
        }
        this.buildVariantFormArray(product.variantList.items, languageCode);
    }

    private buildVariantFormArray(variants: ProductVariant.Fragment[], languageCode: LanguageCode) {
        const variantsFormArray = this.detailForm.get('variants') as FormArray;
        variants.forEach((variant, i) => {
            const variantTranslation = findTranslation(variant, languageCode);
            const pendingFacetValueChanges = this.variantFacetValueChanges[variant.id];
            const facetValueIds = pendingFacetValueChanges
                ? pendingFacetValueChanges.map(fv => fv.id)
                : variant.facetValues.map(fv => fv.id);
            const group: VariantFormValue = {
                id: variant.id,
                enabled: variant.enabled,
                sku: variant.sku,
                name: variantTranslation ? variantTranslation.name : '',
                price: variant.price,
                priceWithTax: variant.priceWithTax,
                taxCategoryId: variant.taxCategory.id,
                stockOnHand: variant.stockOnHand,
                useGlobalOutOfStockThreshold: variant.useGlobalOutOfStockThreshold,
                outOfStockThreshold: variant.outOfStockThreshold,
                trackInventory: variant.trackInventory,
                facetValueIds,
            };

            let variantFormGroup = variantsFormArray.controls.find(c => c.value.id === variant.id) as
                | FormGroup
                | undefined;
            if (variantFormGroup) {
                if (variantFormGroup.pristine) {
                    variantFormGroup.patchValue(group);
                }
            } else {
                variantFormGroup = this.formBuilder.group({
                    ...group,
                    facetValueIds: this.formBuilder.control(facetValueIds),
                });
                variantsFormArray.insert(i, variantFormGroup);
            }
            if (this.customVariantFields.length) {
                let customFieldsGroup = variantFormGroup.get(['customFields']) as FormGroup | undefined;

                if (!customFieldsGroup) {
                    customFieldsGroup = this.formBuilder.group(
                        this.customVariantFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
                    );
                    variantFormGroup.addControl('customFields', customFieldsGroup);
                }
                this.setCustomFieldFormValues(
                    this.customVariantFields,
                    customFieldsGroup,
                    variant,
                    variantTranslation,
                );
            }
        });
    }

    /**
     * Given a product and the value of the detailForm, this method creates an updated copy of the product which
     * can then be persisted to the API.
     */
    private getUpdatedProduct(
        product: GetProductWithVariants.Product,
        productFormGroup: FormGroup,
        languageCode: LanguageCode,
    ): UpdateProductInput | CreateProductInput {
        const updatedProduct = createUpdatedTranslatable({
            translatable: product,
            updatedFields: productFormGroup.value,
            customFieldConfig: this.customFields,
            languageCode,
            defaultTranslation: {
                languageCode,
                name: product.name || '',
                slug: product.slug || '',
                description: product.description || '',
            },
        });
        return {
            ...updatedProduct,
            assetIds: this.assetChanges.assets?.map(a => a.id),
            featuredAssetId: this.assetChanges.featuredAsset?.id,
            facetValueIds: productFormGroup.value.facetValueIds,
        } as UpdateProductInput | CreateProductInput;
    }

    /**
     * Given an array of product variants and the values from the detailForm, this method creates an new array
     * which can be persisted to the API.
     */
    private getUpdatedProductVariants(
        product: GetProductWithVariants.Product,
        variantsFormArray: FormArray,
        languageCode: LanguageCode,
        priceIncludesTax: boolean,
    ): UpdateProductVariantInput[] {
        const dirtyFormControls = variantsFormArray.controls.filter(c => c.dirty);
        const dirtyVariants = dirtyFormControls
            .map(c => this.productVariantMap.get(c.value.id))
            .filter(notNullOrUndefined);
        const dirtyVariantValues = dirtyFormControls.map(c => c.value);

        if (dirtyVariants.length !== dirtyVariantValues.length) {
            throw new Error(_(`error.product-variant-form-values-do-not-match`));
        }
        return dirtyVariants
            .map((variant, i) => {
                const formValue: VariantFormValue = dirtyVariantValues.find(value => value.id === variant.id);
                const result: UpdateProductVariantInput = createUpdatedTranslatable({
                    translatable: variant,
                    updatedFields: formValue,
                    customFieldConfig: this.customVariantFields,
                    languageCode,
                    defaultTranslation: {
                        languageCode,
                        name: '',
                    },
                });
                result.taxCategoryId = formValue.taxCategoryId;
                result.facetValueIds = formValue.facetValueIds;
                result.price = priceIncludesTax ? formValue.priceWithTax : formValue.price;
                const assetChanges = this.variantAssetChanges[variant.id];
                if (assetChanges) {
                    result.featuredAssetId = assetChanges.featuredAsset?.id;
                    result.assetIds = assetChanges.assets?.map(a => a.id);
                }
                return result;
            })
            .filter(notNullOrUndefined);
    }

    private getProductFormGroup(): FormGroup {
        return this.detailForm.get('product') as FormGroup;
    }

    /**
     * The server may alter the slug value in order to normalize and ensure uniqueness upon saving.
     */
    private updateSlugAfterSave(results: Array<UpdateProductMutation | UpdateProductVariantsMutation>) {
        const firstResult = results[0];
        const slugControl = this.detailForm.get(['product', 'slug']);

        function isUpdateMutation(input: any): input is UpdateProductMutation {
            return input.hasOwnProperty('updateProduct');
        }

        if (slugControl && isUpdateMutation(firstResult)) {
            slugControl.setValue(firstResult.updateProduct.slug, { emitEvent: false });
        }
    }
}
