import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, EMPTY, forkJoin, Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import {
    LanguageCode,
    ProductWithVariants,
    ProductWithVariants_variants,
    UpdateProductInput,
    UpdateProductVariantInput,
} from 'shared/generated-types';
import { CustomFieldConfig } from 'shared/shared-types';
import { notNullOrUndefined } from 'shared/shared-utils';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { createUpdatedTranslatable } from '../../../common/utilities/create-updated-translatable';
import { normalizeString } from '../../../common/utilities/normalize-string';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ModalService } from '../../../shared/providers/modal/modal.service';
import { ApplyFacetDialogComponent } from '../apply-facet-dialog/apply-facet-dialog.component';

@Component({
    selector: 'vdr-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailComponent extends BaseDetailComponent<ProductWithVariants>
    implements OnInit, OnDestroy {
    product$: Observable<ProductWithVariants>;
    variants$: Observable<ProductWithVariants_variants[]>;
    customFields: CustomFieldConfig[];
    customVariantFields: CustomFieldConfig[];
    productForm: FormGroup;

    constructor(
        route: ActivatedRoute,
        router: Router,
        private dataService: DataService,
        private formBuilder: FormBuilder,
        private modalService: ModalService,
        private notificationService: NotificationService,
    ) {
        super(route, router);
    }

    ngOnInit() {
        this.init();
        this.customFields = this.getCustomFieldConfig('Product');
        this.customVariantFields = this.getCustomFieldConfig('ProductVariant');
        this.product$ = this.entity$;
        this.variants$ = this.product$.pipe(map(product => product.variants));
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

    ngOnDestroy() {
        this.destroy();
    }

    setLanguage(code: LanguageCode) {
        this.setQueryParam('lang', code);
    }

    customFieldIsSet(name: string): boolean {
        return !!this.productForm.get(['product', 'customFields', name]);
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
                    );
                    return this.dataService.product.createProduct(newProduct);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('catalog.notify-create-product-success'));
                    this.productForm.markAsPristine();
                    this.router.navigate(['../', data.createProduct.id], { relativeTo: this.route });
                },
                err => {
                    this.notificationService.error(_('catalog.notify-create-product-error'));
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

                    if (productGroup && productGroup.dirty) {
                        const newProduct = this.getUpdatedProduct(
                            product,
                            productGroup as FormGroup,
                            languageCode,
                        );
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
                    this.notificationService.success(_('catalog.notify-update-product-success'));
                },
                err => {
                    this.notificationService.error(_('catalog.notify-update-product-error'), {
                        error: err.message,
                    });
                },
            );
    }

    /**
     * Sets the values of the form on changes to the product or current language.
     */
    protected setFormValues(product: ProductWithVariants, languageCode: LanguageCode) {
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
        product: ProductWithVariants,
        productFormGroup: FormGroup,
        languageCode: LanguageCode,
    ): UpdateProductInput {
        return createUpdatedTranslatable(product, productFormGroup.value, this.customFields, languageCode, {
            languageCode,
            name: product.name || '',
            slug: product.slug || '',
            description: product.description || '',
        });
    }

    /**
     * Given an array of product variants and the values from the productForm, this method creates an new array
     * which can be persisted to the API.
     */
    private getUpdatedProductVariants(
        product: ProductWithVariants,
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
                return createUpdatedTranslatable(
                    variant,
                    dirtyVariantValues[i],
                    this.customVariantFields,
                    languageCode,
                );
            })
            .filter(notNullOrUndefined);
    }
}
