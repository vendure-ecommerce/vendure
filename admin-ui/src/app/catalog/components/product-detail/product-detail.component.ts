import { Location } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, forkJoin, merge, Observable } from 'rxjs';
import { distinctUntilChanged, map, mergeMap, skip, take, withLatestFrom } from 'rxjs/operators';
import {
    CreateProductInput,
    FacetWithValues,
    LanguageCode,
    ProductWithVariants,
    TaxCategory,
    UpdateProductInput,
    UpdateProductVariantInput,
} from 'shared/generated-types';
import { normalizeString } from 'shared/normalize-string';
import { CustomFieldConfig } from 'shared/shared-types';
import { notNullOrUndefined } from 'shared/shared-utils';
import { unique } from 'shared/unique';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { createUpdatedTranslatable } from '../../../common/utilities/create-updated-translatable';
import { flattenFacetValues } from '../../../common/utilities/flatten-facet-values';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ServerConfigService } from '../../../data/server-config';
import { ModalService } from '../../../shared/providers/modal/modal.service';
import { ApplyFacetDialogComponent } from '../apply-facet-dialog/apply-facet-dialog.component';
import { VariantAssetChange } from '../product-variants-list/product-variants-list.component';

export type TabName = 'details' | 'variants';
export interface VariantFormValue {
    sku: string;
    name: string;
    price: number;
    priceIncludesTax: boolean;
    priceWithTax: number;
    taxCategoryId: string;
    facetValueIds: string[];
}

export interface SelectedAssets {
    assetIds?: string[];
    featuredAssetId?: string;
}

@Component({
    selector: 'vdr-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent extends BaseDetailComponent<ProductWithVariants.Fragment>
    implements OnInit, OnDestroy {
    activeTab$: Observable<TabName>;
    product$: Observable<ProductWithVariants.Fragment>;
    variants$: Observable<ProductWithVariants.Variants[]>;
    taxCategories$: Observable<TaxCategory.Fragment[]>;
    customFields: CustomFieldConfig[];
    customVariantFields: CustomFieldConfig[];
    detailForm: FormGroup;
    assetChanges: SelectedAssets = {};
    variantAssetChanges: { [variantId: string]: SelectedAssets } = {};
    facetValues$: Observable<ProductWithVariants.FacetValues[]>;
    facets$ = new BehaviorSubject<FacetWithValues.Fragment[]>([]);
    selectedVariantIds: string[] = [];

    constructor(
        route: ActivatedRoute,
        router: Router,
        serverConfigService: ServerConfigService,
        private dataService: DataService,
        private formBuilder: FormBuilder,
        private modalService: ModalService,
        private notificationService: NotificationService,
        private location: Location,
        private changeDetector: ChangeDetectorRef,
    ) {
        super(route, router, serverConfigService);
        this.customFields = this.getCustomFieldConfig('Product');
        this.customVariantFields = this.getCustomFieldConfig('ProductVariant');
        this.detailForm = this.formBuilder.group({
            product: this.formBuilder.group({
                name: ['', Validators.required],
                slug: '',
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
        this.variants$ = this.product$.pipe(map(product => product.variants));
        this.taxCategories$ = this.dataService.settings
            .getTaxCategories()
            .mapSingle(data => data.taxCategories);
        this.activeTab$ = this.route.paramMap.pipe(map(qpm => qpm.get('tab') as any));

        // FacetValues are provided initially by the nested array of the
        // Product entity, but once a fetch to get all Facets is made (as when
        // opening the FacetValue selector modal), then these additional values
        // are concatenated onto the initial array.
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
    }

    ngOnDestroy() {
        this.destroy();
    }

    navigateToTab(tabName: TabName) {
        this.router.navigate(['./', { tab: tabName }], {
            relativeTo: this.route,
        });
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
        this.isNew$.pipe(take(1)).subscribe(isNew => {
            if (isNew) {
                const slugControl = this.detailForm.get(['product', 'slug']);
                if (slugControl && slugControl.pristine) {
                    slugControl.setValue(normalizeString(`${nameValue}`, '-'));
                }
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

    private displayFacetValueModal(): Observable<string[] | undefined> {
        let skipValue = 0;
        if (this.facets$.value.length === 0) {
            this.dataService.facet
                .getFacets(9999999, 0)
                .mapSingle(data => data.facets.items)
                .subscribe(items => this.facets$.next(items));
            skipValue = 1;
        }

        return this.facets$.pipe(
            skip(skipValue),
            take(1),
            mergeMap(facets =>
                this.modalService.fromComponent(ApplyFacetDialogComponent, {
                    size: 'md',
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
                    return this.dataService.product.createProduct(newProduct);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-create-success'), {
                        entity: 'Product',
                    });
                    this.assetChanges = {};
                    this.variantAssetChanges = {};
                    this.detailForm.markAsPristine();
                    this.router.navigate(['../', data.createProduct.id], { relativeTo: this.route });
                },
                err => {
                    this.notificationService.error(_('common.notify-create-error'), {
                        entity: 'Product',
                    });
                },
            );
    }

    save() {
        combineLatest(this.product$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([product, languageCode]) => {
                    const productGroup = this.getProductFormGroup();
                    const updateOperations: Array<Observable<any>> = [];

                    if (productGroup.dirty || this.assetsChanged()) {
                        const newProduct = this.getUpdatedProduct(
                            product,
                            productGroup as FormGroup,
                            languageCode,
                        ) as UpdateProductInput;
                        if (newProduct) {
                            updateOperations.push(this.dataService.product.updateProduct(newProduct));
                        }
                    }
                    const variantsArray = this.detailForm.get('variants');
                    if ((variantsArray && variantsArray.dirty) || this.variantAssetsChanged()) {
                        const newVariants = this.getUpdatedProductVariants(
                            product,
                            variantsArray as FormArray,
                            languageCode,
                        );
                        updateOperations.push(this.dataService.product.updateProductVariants(newVariants));
                    }

                    return forkJoin(updateOperations);
                }),
            )
            .subscribe(
                () => {
                    this.detailForm.markAsPristine();
                    this.assetChanges = {};
                    this.variantAssetChanges = {};
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'Product',
                    });
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Product',
                    });
                },
            );
    }

    /**
     * Sets the values of the form on changes to the product or current language.
     */
    protected setFormValues(product: ProductWithVariants.Fragment, languageCode: LanguageCode) {
        const currentTranslation = product.translations.find(t => t.languageCode === languageCode);
        this.detailForm.patchValue({
            product: {
                name: currentTranslation ? currentTranslation.name : '',
                slug: currentTranslation ? currentTranslation.slug : '',
                description: currentTranslation ? currentTranslation.description : '',
                facetValueIds: product.facetValues.map(fv => fv.id),
            },
        });

        if (this.customFields.length) {
            const customFieldsGroup = this.detailForm.get(['product', 'customFields']) as FormGroup;

            for (const fieldDef of this.customFields) {
                const key = fieldDef.name;
                const value =
                    fieldDef.type === 'localeString'
                        ? (currentTranslation as any).customFields[key]
                        : (product as any).customFields[key];
                const control = customFieldsGroup.get(key);
                if (control) {
                    control.patchValue(value);
                }
            }
        }

        const variantsFormArray = this.detailForm.get('variants') as FormArray;
        product.variants.forEach((variant, i) => {
            const variantTranslation = variant.translations.find(t => t.languageCode === languageCode);
            const facetValueIds = variant.facetValues.map(fv => fv.id);
            const group: VariantFormValue = {
                sku: variant.sku,
                name: variantTranslation ? variantTranslation.name : '',
                price: variant.price,
                priceIncludesTax: variant.priceIncludesTax,
                priceWithTax: variant.priceWithTax,
                taxCategoryId: variant.taxCategory.id,
                facetValueIds,
            };

            const existing = variantsFormArray.at(i);
            if (existing) {
                existing.setValue(group);
            } else {
                variantsFormArray.insert(
                    i,
                    this.formBuilder.group({
                        ...group,
                        facetValueIds: this.formBuilder.control(facetValueIds),
                    }),
                );
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
            ...this.assetChanges,
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
                const assetChanges = this.variantAssetChanges[variant.id];
                if (assetChanges) {
                    result.featuredAssetId = assetChanges.featuredAssetId;
                    result.assetIds = assetChanges.assetIds;
                }
                return result;
            })
            .filter(notNullOrUndefined);
    }

    private getProductFormGroup(): FormGroup {
        return this.detailForm.get('product') as FormGroup;
    }
}
