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
    FacetWithValues,
    findTranslation,
    flattenFacetValues,
    GlobalFlag,
    LanguageCode,
    ModalService,
    NotificationService,
    ProductWithVariants,
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
import { combineLatest, EMPTY, merge, Observable } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    map,
    mergeMap,
    shareReplay,
    startWith,
    switchMap,
    take,
    takeUntil,
    withLatestFrom,
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

@Component({
    selector: 'vdr-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent
    extends BaseDetailComponent<ProductWithVariants.Fragment>
    implements OnInit, OnDestroy
{
    activeTab$: Observable<TabName>;
    product$: Observable<ProductWithVariants.Fragment>;
    variants$: Observable<ProductWithVariants.Variants[]>;
    taxCategories$: Observable<TaxCategory.Fragment[]>;
    customFields: CustomFieldConfig[];
    customVariantFields: CustomFieldConfig[];
    customOptionGroupFields: CustomFieldConfig[];
    customOptionFields: CustomFieldConfig[];
    detailForm: FormGroup;
    filterInput = new FormControl('');
    assetChanges: SelectedAssets = {};
    variantAssetChanges: { [variantId: string]: SelectedAssets } = {};
    productChannels$: Observable<ProductWithVariants.Channels[]>;
    facetValues$: Observable<ProductWithVariants.FacetValues[]>;
    facets$: Observable<FacetWithValues.Fragment[]>;
    selectedVariantIds: string[] = [];
    variantDisplayMode: 'card' | 'table' = 'card';
    createVariantsConfig: CreateProductVariantsConfig = { groups: [], variants: [] };
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
        const variants$ = this.product$.pipe(map(product => product.variants));
        const filterTerm$ = this.filterInput.valueChanges.pipe(
            startWith(''),
            debounceTime(50),
            shareReplay(),
        );
        this.variants$ = combineLatest(variants$, filterTerm$).pipe(
            map(([variants, term]) => {
                return term
                    ? variants.filter(v => {
                          const lcTerm = term.toLocaleLowerCase();
                          return (
                              v.name.toLocaleLowerCase().includes(lcTerm) ||
                              v.sku.toLocaleLowerCase().includes(lcTerm)
                          );
                      })
                    : variants;
            }),
        );
        this.taxCategories$ = this.productDetailService.getTaxCategories().pipe(takeUntil(this.destroy$));
        this.activeTab$ = this.route.paramMap.pipe(map(qpm => qpm.get('tab') as any));

        // FacetValues are provided initially by the nested array of the
        // Product entity, but once a fetch to get all Facets is made (as when
        // opening the FacetValue selector modal), then these additional values
        // are concatenated onto the initial array.
        this.facets$ = this.productDetailService.getFacets();
        const productFacetValues$ = this.product$.pipe(map(product => product.facetValues));
        const allFacetValues$ = this.facets$.pipe(map(flattenFacetValues));
        const productGroup = this.getProductFormGroup();

        const formFacetValueIdChanges$ = productGroup.valueChanges.pipe(
            map(val => val.facetValueIds as string[]),
            distinctUntilChanged(),
        );
        const formChangeFacetValues$ = combineLatest(
            formFacetValueIdChanges$,
            productFacetValues$,
            allFacetValues$,
        ).pipe(
            map(([ids, productFacetValues, allFacetValues]) => {
                const combined = [...productFacetValues, ...allFacetValues];
                return ids.map(id => combined.find(fv => fv.id === id)).filter(notNullOrUndefined);
            }),
        );

        this.facetValues$ = merge(productFacetValues$, formChangeFacetValues$);
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
        this.modalService
            .dialog({
                title: _('catalog.remove-product-from-channel'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('catalog.remove-from-channel'), returnValue: true },
                ],
            })
            .pipe(
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

    assignVariantToChannel(variant: ProductWithVariants.Variants) {
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
        variant: ProductWithVariants.Variants;
    }) {
        this.modalService
            .dialog({
                title: _('catalog.remove-product-variant-from-channel'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('catalog.remove-from-channel'), returnValue: true },
                ],
            })
            .pipe(
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

    customFieldIsSet(name: string): boolean {
        return !!this.detailForm.get(['product', 'customFields', name]);
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

    /**
     * Opens a dialog to select FacetValues to apply to the select ProductVariants.
     */
    selectVariantFacetValue(selectedVariantIds: string[]) {
        this.displayFacetValueModal()
            .pipe(withLatestFrom(this.variants$))
            .subscribe(([facetValueIds, variants]) => {
                if (facetValueIds) {
                    for (const variantId of selectedVariantIds) {
                        const index = variants.findIndex(v => v.id === variantId);
                        const variant = variants[index];
                        const existingFacetValueIds = variant ? variant.facetValues.map(fv => fv.id) : [];
                        const variantFormGroup = this.detailForm.get(['variants', index]);
                        if (variantFormGroup) {
                            variantFormGroup.patchValue({
                                facetValueIds: unique([...existingFacetValueIds, ...facetValueIds]),
                            });
                            variantFormGroup.markAsDirty();
                        }
                    }
                    this.changeDetector.markForCheck();
                }
            });
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
        return this.productDetailService.getFacets().pipe(
            mergeMap(facets =>
                this.modalService.fromComponent(ApplyFacetDialogComponent, {
                    size: 'md',
                    closable: true,
                    locals: { facets },
                }),
            ),
            map(facetValues => facetValues && facetValues.map(v => v.id)),
        );
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
    protected setFormValues(product: ProductWithVariants.Fragment, languageCode: LanguageCode) {
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
            const customFieldsGroup = this.detailForm.get(['product', 'customFields']) as FormGroup;
            const cfCurrentTranslation =
                (currentTranslation && (currentTranslation as any).customFields) || {};
            const cfProduct = (product as any).customFields || {};

            for (const fieldDef of this.customFields) {
                const key = fieldDef.name;
                const value = fieldDef.type === 'localeString' ? cfCurrentTranslation[key] : cfProduct[key];
                const control = customFieldsGroup.get(key);
                if (control) {
                    control.patchValue(value);
                }
            }
        }

        const variantsFormArray = this.detailForm.get('variants') as FormArray;
        product.variants.forEach((variant, i) => {
            const variantTranslation = findTranslation(variant, languageCode);
            const facetValueIds = variant.facetValues.map(fv => fv.id);
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

            let variantFormGroup = variantsFormArray.at(i) as FormGroup | undefined;
            if (variantFormGroup) {
                variantFormGroup.patchValue(group);
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

                for (const fieldDef of this.customVariantFields) {
                    const key = fieldDef.name;
                    const value =
                        fieldDef.type === 'localeString'
                            ? (variantTranslation as any).customFields[key]
                            : (variant as any).customFields[key];
                    const control = customFieldsGroup.get(key);
                    if (control) {
                        control.patchValue(value);
                    }
                }
            }
        });
    }

    /**
     * Given a product and the value of the detailForm, this method creates an updated copy of the product which
     * can then be persisted to the API.
     */
    private getUpdatedProduct(
        product: ProductWithVariants.Fragment,
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
        product: ProductWithVariants.Fragment,
        variantsFormArray: FormArray,
        languageCode: LanguageCode,
        priceIncludesTax: boolean,
    ): UpdateProductVariantInput[] {
        const dirtyVariants = product.variants.filter((v, i) => {
            const formRow = variantsFormArray.get(i.toString());
            return formRow && formRow.dirty;
        });
        const dirtyVariantValues = variantsFormArray.controls.filter(c => c.dirty).map(c => c.value);

        if (dirtyVariants.length !== dirtyVariantValues.length) {
            throw new Error(_(`error.product-variant-form-values-do-not-match`));
        }
        return dirtyVariants
            .map((variant, i) => {
                const formValue: VariantFormValue = dirtyVariantValues[i];
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
