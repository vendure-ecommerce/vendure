import { Component, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, forkJoin, Observable, Subject } from 'rxjs';
import { filter, map, mergeMap, switchMap, take, takeUntil } from 'rxjs/operators';

import { notNullOrUndefined } from '../../../../../../shared/shared-utils';
import { getDefaultLanguage } from '../../../common/utilities/get-default-language';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import {
    GetProductWithVariants_product,
    GetProductWithVariants_product_variants,
    LanguageCode,
} from '../../../data/types/gql-generated-types';
import { ModalService } from '../../../shared/providers/modal/modal.service';
import { ProductUpdaterService } from '../../providers/product-updater/product-updater.service';
import { CreateOptionGroupDialogComponent } from '../create-option-group-dialog/create-option-group-dialog.component';
import { SelectOptionGroupDialogComponent } from '../select-option-group-dialog/select-option-group-dialog.component';

@Component({
    selector: 'vdr-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnDestroy {
    product$: Observable<GetProductWithVariants_product>;
    variants$: Observable<GetProductWithVariants_product_variants[]>;
    availableLanguages$: Observable<LanguageCode[]>;
    languageCode$: Observable<LanguageCode>;
    isNew$: Observable<boolean>;
    productForm: FormGroup;
    private destroy$ = new Subject<void>();

    constructor(
        private dataService: DataService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private modalService: ModalService,
        private notificationService: NotificationService,
        private productUpdaterService: ProductUpdaterService,
    ) {
        this.product$ = this.route.data.pipe(switchMap(data => data.product));
        this.variants$ = this.product$.pipe(map(product => product.variants));
        this.productForm = this.formBuilder.group({
            product: this.formBuilder.group({
                name: ['', Validators.required],
                slug: '',
                description: '',
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
            .subscribe(([product, languageCode]) => {
                const currentTranslation = product.translations.find(t => t.languageCode === languageCode);
                if (currentTranslation) {
                    this.productForm.patchValue({
                        product: {
                            name: currentTranslation.name,
                            slug: currentTranslation.slug,
                            description: currentTranslation.description,
                        },
                    });

                    const variantsFormArray = this.productForm.get('variants') as FormArray;
                    product.variants.forEach((variant, i) => {
                        const variantTranslation = variant.translations.find(
                            t => t.languageCode === languageCode,
                        );

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
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    setLanguage(code: LanguageCode) {
        this.setQueryParam('lang', code);
    }

    createNewOptionGroup() {
        this.product$
            .pipe(
                take(1),
                mergeMap(product => {
                    const nameControl = this.productForm.get('name');
                    const productName = nameControl ? nameControl.value : '';
                    return this.modalService
                        .fromComponent(CreateOptionGroupDialogComponent, {
                            closable: true,
                            size: 'lg',
                            locals: {
                                productName,
                                productId: product.id,
                            },
                        })
                        .pipe(
                            filter(notNullOrUndefined),
                            mergeMap(({ createProductOptionGroup }) => {
                                return this.dataService.product.addOptionGroupToProduct({
                                    productId: product.id,
                                    optionGroupId: createProductOptionGroup.id,
                                });
                            }),
                        );
                }),
            )
            .subscribe();
    }

    addExistingOptionGroup() {
        this.product$
            .pipe(
                take(1),
                mergeMap(product => {
                    return this.modalService
                        .fromComponent(SelectOptionGroupDialogComponent, {
                            closable: true,
                            size: 'lg',
                            locals: {
                                existingOptionGroupIds: product.optionGroups.map(g => g.id),
                            },
                        })
                        .pipe(
                            filter(notNullOrUndefined),
                            mergeMap(optionGroup => {
                                return this.dataService.product.addOptionGroupToProduct({
                                    productId: product.id,
                                    optionGroupId: optionGroup.id,
                                });
                            }),
                        );
                }),
            )
            .subscribe();
    }

    removeGroup(optionGroupId: string) {
        this.product$
            .pipe(
                take(1),
                mergeMap(product => {
                    return this.dataService.product.removeOptionGroupFromProduct({
                        productId: product.id,
                        optionGroupId,
                    });
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
                    const newProduct = this.productUpdaterService.getUpdatedProduct(
                        product,
                        productGroup.value,
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
                        const newProduct = this.productUpdaterService.getUpdatedProduct(
                            product,
                            productGroup.value,
                            languageCode,
                        );
                        if (newProduct) {
                            updateOperations.push(this.dataService.product.updateProduct(newProduct));
                        }
                    }
                    const variantsArray = this.productForm.get('variants');
                    if (variantsArray && variantsArray.dirty) {
                        const newVariants = this.productUpdaterService.getUpdatedProductVariants(
                            product.variants,
                            variantsArray.value,
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
                    this.notificationService.error(_('catalog.notify-update-product-error'));
                },
            );
    }

    generateProductVariants() {
        this.product$
            .pipe(
                take(1),
                mergeMap(product => this.dataService.product.generateProductVariants(product.id)),
            )
            .subscribe();
    }

    private setQueryParam(key: string, value: any) {
        this.router.navigate(['./'], {
            queryParams: { [key]: value },
            relativeTo: this.route,
            queryParamsHandling: 'merge',
        });
    }
}
