import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, EMPTY, forkJoin, Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import {
    CreateProductInput,
    LanguageCode,
    ProductWithVariants,
    TaxCategory,
    UpdateProductInput,
    UpdateProductVariantInput,
} from 'shared/generated-types';
import { normalizeString } from 'shared/normalize-string';
import { CustomFieldConfig } from 'shared/shared-types';
import { notNullOrUndefined } from 'shared/shared-utils';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { createUpdatedTranslatable } from '../../../common/utilities/create-updated-translatable';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ServerConfigService } from '../../../data/server-config';
import { ModalService } from '../../../shared/providers/modal/modal.service';
import { ApplyFacetDialogComponent } from '../apply-facet-dialog/apply-facet-dialog.component';

@Component({
    selector: 'vdr-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent extends BaseDetailComponent<ProductWithVariants.Fragment>
    implements OnInit, OnDestroy {
    product$: Observable<ProductWithVariants.Fragment>;
    variants$: Observable<ProductWithVariants.Variants[]>;
    taxCategories$: Observable<TaxCategory.Fragment[]>;
    customFields: CustomFieldConfig[];
    customVariantFields: CustomFieldConfig[];
    productForm: FormGroup;
    assetChanges: { assetIds?: string[]; featuredAssetId?: string } = {};

    constructor(
        route: ActivatedRoute,
        router: Router,
        serverConfigService: ServerConfigService,
        private dataService: DataService,
        private formBuilder: FormBuilder,
        private modalService: ModalService,
        private notificationService: NotificationService,
    ) {
        super(route, router, serverConfigService);
        this.customFields = this.getCustomFieldConfig('Product');
        this.customVariantFields = this.getCustomFieldConfig('ProductVariant');
        this.productForm = this.formBuilder.group({
            product: this.formBuilder.group({
                name: ['', Validators.required],
                slug: '',
                description: '',
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
    }

    ngOnDestroy() {
        this.destroy();
    }

    customFieldIsSet(name: string): boolean {
        return !!this.productForm.get(['product', 'customFields', name]);
    }

    assetsChanged(): boolean {
        return !!Object.values(this.assetChanges).length;
    }

    /**
     * If creating a new product, automatically generate the slug based on the product name.
     */
    updateSlug(nameValue: string) {
        this.isNew$.pipe(take(1)).subscribe(isNew => {
            if (isNew) {
                const slugControl = this.productForm.get(['product', 'slug']);
                if (slugControl && slugControl.pristine) {
                    slugControl.setValue(normalizeString(`${nameValue}`, '-'));
                }
            }
        });
    }

    /**
     * Opens a dialog to select FacetValues to apply to the select ProductVariants.
     */
    selectFacetValue(selectedVariantIds: string[]) {
        this.modalService
            .fromComponent(ApplyFacetDialogComponent, { size: 'md' })
            .pipe(
                map(facetValues => facetValues && facetValues.map(v => v.id)),
                mergeMap(facetValueIds => {
                    if (facetValueIds) {
                        return this.dataService.product.applyFacetValuesToProductVariants(
                            facetValueIds,
                            selectedVariantIds,
                        );
                    } else {
                        return EMPTY;
                    }
                }),
            )
            .subscribe();
    }

    create() {
        const productGroup = this.productForm.get('product');
        if (!productGroup || !productGroup.dirty) {
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
                    this.productForm.markAsPristine();
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
                    const productGroup = this.productForm.get('product');
                    const updateOperations: Array<Observable<any>> = [];

                    if ((productGroup && productGroup.dirty) || this.assetsChanged()) {
                        const newProduct = this.getUpdatedProduct(
                            product,
                            productGroup as FormGroup,
                            languageCode,
                        ) as UpdateProductInput;
                        if (newProduct) {
                            updateOperations.push(this.dataService.product.updateProduct(newProduct));
                        }
                    }
                    const variantsArray = this.productForm.get('variants');
                    if (variantsArray && variantsArray.dirty) {
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
                    this.productForm.markAsPristine();
                    this.assetChanges = {};
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
        if (currentTranslation) {
            this.productForm.patchValue({
                product: {
                    name: currentTranslation.name,
                    slug: currentTranslation.slug,
                    description: currentTranslation.description,
                },
            });

            if (this.customFields.length) {
                const customFieldsGroup = this.productForm.get(['product', 'customFields']) as FormGroup;

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

            const variantsFormArray = this.productForm.get('variants') as FormArray;
            product.variants.forEach((variant, i) => {
                const variantTranslation = variant.translations.find(t => t.languageCode === languageCode);

                const group = {
                    sku: variant.sku,
                    name: variantTranslation ? variantTranslation.name : '',
                    price: variant.price,
                    priceIncludesTax: variant.priceIncludesTax,
                    priceWithTax: variant.priceWithTax,
                    taxCategoryId: variant.taxCategory.id,
                };

                const existing = variantsFormArray.at(i);
                if (existing) {
                    existing.setValue(group);
                } else {
                    variantsFormArray.insert(i, this.formBuilder.group(group));
                }
            });
        }
    }

    /**
     * Given a product and the value of the productForm, this method creates an updated copy of the product which
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
        return { ...updatedProduct, ...this.assetChanges } as UpdateProductInput | CreateProductInput;
    }

    /**
     * Given an array of product variants and the values from the productForm, this method creates an new array
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
                const updated = createUpdatedTranslatable({
                    translatable: variant,
                    updatedFields: dirtyVariantValues[i],
                    customFieldConfig: this.customVariantFields,
                    languageCode,
                }) as UpdateProductVariantInput;
                updated.taxCategoryId = dirtyVariantValues[i].taxCategoryId;
                return updated;
            })
            .filter(notNullOrUndefined);
    }
}
