import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, forkJoin, Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import {
    CreateProductCategoryInput,
    CreateProductInput,
    LanguageCode,
    ProductCategory,
    UpdateProductCategoryInput,
    UpdateProductInput,
} from 'shared/generated-types';
import { CustomFieldConfig } from 'shared/shared-types';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { createUpdatedTranslatable } from '../../../common/utilities/create-updated-translatable';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ServerConfigService } from '../../../data/server-config';

@Component({
    selector: 'vdr-product-category-detail',
    templateUrl: './product-category-detail.component.html',
    styleUrls: ['./product-category-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCategoryDetailComponent extends BaseDetailComponent<ProductCategory.Fragment>
    implements OnInit, OnDestroy {
    customFields: CustomFieldConfig[];
    categoryForm: FormGroup;
    assetChanges: { assetIds?: string[]; featuredAssetId?: string } = {};

    constructor(
        router: Router,
        route: ActivatedRoute,
        serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        private dataService: DataService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
    ) {
        super(route, router, serverConfigService);
        this.customFields = this.getCustomFieldConfig('ProductCategory');
        this.categoryForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: '',
            customFields: this.formBuilder.group(
                this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
            ),
        });
    }

    ngOnInit() {
        this.init();
    }

    ngOnDestroy() {
        this.destroy();
    }

    customFieldIsSet(name: string): boolean {
        return !!this.categoryForm.get(['customFields', name]);
    }

    assetsChanged(): boolean {
        return !!Object.values(this.assetChanges).length;
    }

    create() {
        if (!this.categoryForm.dirty) {
            return;
        }
        combineLatest(this.entity$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([category, languageCode]) => {
                    const input = this.getUpdatedCategory(category, this.categoryForm, languageCode);
                    return this.dataService.product.createProductCategory(input);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-create-success'), {
                        entity: 'ProductCategory',
                    });
                    this.categoryForm.markAsPristine();
                    this.changeDetector.markForCheck();
                    this.router.navigate(['../', data.createProductCategory.id], { relativeTo: this.route });
                },
                err => {
                    this.notificationService.error(_('common.notify-create-error'), {
                        entity: 'ProductCategory',
                    });
                },
            );
    }

    save() {
        combineLatest(this.entity$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([category, languageCode]) => {
                    const updateOperations: Array<Observable<any>> = [];

                    if (this.categoryForm.dirty || this.assetsChanged()) {
                        const input = this.getUpdatedCategory(
                            category,
                            this.categoryForm,
                            languageCode,
                        ) as UpdateProductCategoryInput;
                        if (input) {
                            updateOperations.push(this.dataService.product.updateProductCategory(input));
                        }
                    }
                    return forkJoin(updateOperations);
                }),
            )
            .subscribe(
                () => {
                    this.categoryForm.markAsPristine();
                    this.changeDetector.markForCheck();
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'ProductCategory',
                    });
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'ProductCategory',
                    });
                },
            );
    }

    /**
     * Sets the values of the form on changes to the category or current language.
     */
    protected setFormValues(category: ProductCategory.Fragment, languageCode: LanguageCode) {
        const currentTranslation = category.translations.find(t => t.languageCode === languageCode);
        if (currentTranslation) {
            this.categoryForm.patchValue({
                name: currentTranslation.name,
                description: currentTranslation.description,
            });

            if (this.customFields.length) {
                const customFieldsGroup = this.categoryForm.get(['customFields']) as FormGroup;

                for (const fieldDef of this.customFields) {
                    const key = fieldDef.name;
                    const value =
                        fieldDef.type === 'localeString'
                            ? (currentTranslation as any).customFields[key]
                            : (category as any).customFields[key];
                    const control = customFieldsGroup.get(key);
                    if (control) {
                        control.patchValue(value);
                    }
                }
            }
        }
    }

    /**
     * Given a category and the value of the form, this method creates an updated copy of the category which
     * can then be persisted to the API.
     */
    private getUpdatedCategory(
        category: ProductCategory.Fragment,
        form: FormGroup,
        languageCode: LanguageCode,
    ): CreateProductCategoryInput | UpdateProductCategoryInput {
        const updatedCategory = createUpdatedTranslatable({
            translatable: category,
            updatedFields: form.value,
            customFieldConfig: this.customFields,
            languageCode,
            defaultTranslation: {
                languageCode,
                name: category.name || '',
                description: category.description || '',
            },
        });
        return { ...updatedCategory, ...this.assetChanges };
    }
}
