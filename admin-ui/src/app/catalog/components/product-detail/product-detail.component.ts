import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, forkJoin, Observable, Subject } from 'rxjs';
import { map, mergeMap, switchMap, take, takeUntil } from 'rxjs/operators';

import { CustomFieldConfig } from '../../../../../../shared/shared-types';
import { notNullOrUndefined } from '../../../../../../shared/shared-utils';
import { createUpdatedTranslatable } from '../../../common/utilities/create-updated-translatable';
import { getDefaultLanguage } from '../../../common/utilities/get-default-language';
import { normalizeString } from '../../../common/utilities/normalize-string';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { getServerConfig } from '../../../data/server-config';
import {
    LanguageCode,
    ProductWithVariants,
    ProductWithVariants_variants,
    UpdateProductInput,
    UpdateProductVariantInput,
} from '../../../data/types/gql-generated-types';
import { ModalService } from '../../../shared/providers/modal/modal.service';
import { ProductVariantsWizardComponent } from '../product-variants-wizard/product-variants-wizard.component';

@Component({
    selector: 'vdr-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {
    product$: Observable<ProductWithVariants>;
    variants$: Observable<ProductWithVariants_variants[]>;
    availableLanguages$: Observable<LanguageCode[]>;
    customFields: CustomFieldConfig[];
    customVariantFields: CustomFieldConfig[];
    languageCode$: Observable<LanguageCode>;
    isNew$: Observable<boolean>;
    productForm: FormGroup;
    @ViewChild('productVariantsWizard') productVariantsWizard: ProductVariantsWizardComponent;
    private destroy$ = new Subject<void>();

    constructor(
        private dataService: DataService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private modalService: ModalService,
        private notificationService: NotificationService,
    ) {}

    ngOnInit() {
        this.customFields = getServerConfig().customFields.Product || [];
        this.customVariantFields = getServerConfig().customFields.ProductVariant || [];
        this.product$ = this.route.data.pipe(switchMap(data => data.product));
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
        this.isNew$ = this.product$.pipe(map(product => product.id === ''));
        this.languageCode$ = this.route.queryParamMap.pipe(
            map(qpm => qpm.get('lang')),
            map(lang => (!lang ? getDefaultLanguage() : (lang as LanguageCode))),
        );

        this.availableLanguages$ = this.product$.pipe(map(p => p.translations.map(t => t.languageCode)));

        combineLatest(this.product$, this.languageCode$)
            .pipe(takeUntil(this.destroy$))
            .subscribe(([product, languageCode]) => this.setFormValues(product, languageCode));
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
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

    startProductVariantsWizard() {
        this.product$
            .pipe(
                take(1),
                mergeMap(product => this.productVariantsWizard.start()),
            )
            .subscribe(({ defaultPrice, defaultSku }) => {
                this.generateProductVariants(defaultPrice, defaultSku);
            });
    }

    generateProductVariants(defaultPrice?: number, defaultSku?: string) {
        this.product$
            .pipe(
                take(1),
                mergeMap(product =>
                    this.dataService.product.generateProductVariants(product.id, defaultPrice, defaultSku),
                ),
            )
            .subscribe();
    }

    /**
     * Sets the values of the form on changes to the product or current language.
     */
    private setFormValues(product: ProductWithVariants, languageCode: LanguageCode) {
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

    private setQueryParam(key: string, value: any) {
        this.router.navigate(['./'], {
            queryParams: { [key]: value },
            relativeTo: this.route,
            queryParamsHandling: 'merge',
        });
    }
}
