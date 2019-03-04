import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import {
    filter,
    map,
    mergeMap,
    shareReplay,
    startWith,
    switchMap,
    take,
    withLatestFrom,
} from 'rxjs/operators';
import {
    Collection,
    CreateCollectionInput,
    FacetValue,
    FacetWithValues,
    LanguageCode,
    UpdateCollectionInput,
} from 'shared/generated-types';
import { CustomFieldConfig } from 'shared/shared-types';
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

@Component({
    selector: 'vdr-product-category-detail',
    templateUrl: './product-category-detail.component.html',
    styleUrls: ['./product-category-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductCategoryDetailComponent extends BaseDetailComponent<Collection.Fragment>
    implements OnInit, OnDestroy {
    customFields: CustomFieldConfig[];
    detailForm: FormGroup;
    assetChanges: { assetIds?: string[]; featuredAssetId?: string } = {};
    facetValues$: Observable<FacetValue.Fragment[]>;
    private facets$: Observable<FacetWithValues.Fragment[]>;

    constructor(
        router: Router,
        route: ActivatedRoute,
        serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        private dataService: DataService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private modalService: ModalService,
    ) {
        super(route, router, serverConfigService);
        this.customFields = this.getCustomFieldConfig('Collection');
        this.detailForm = this.formBuilder.group({
            name: ['', Validators.required],
            description: '',
            facetValueIds: [[]],
            customFields: this.formBuilder.group(
                this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
            ),
        });
    }

    ngOnInit() {
        this.init();
        this.facets$ = this.dataService.facet
            .getFacets(9999999, 0)
            .mapSingle(data => data.facets.items)
            .pipe(shareReplay(1));

        const facetValues$ = this.facets$.pipe(map(facets => flattenFacetValues(facets)));
        const facetValueIds$ = this.entity$.pipe(
            filter(category => !!(category && category.facetValues)),
            take(1),
            switchMap(category => this.detailForm.valueChanges),
            startWith(this.detailForm.value),
            map(formValue => formValue.facetValueIds),
        );

        this.facetValues$ = combineLatest(facetValueIds$, facetValues$).pipe(
            map(([ids, facetValues]) => ids.map(id => facetValues.find(fv => fv.id === id))),
        );
    }

    ngOnDestroy() {
        this.destroy();
    }

    customFieldIsSet(name: string): boolean {
        return !!this.detailForm.get(['customFields', name]);
    }

    assetsChanged(): boolean {
        return !!Object.values(this.assetChanges).length;
    }

    addFacetValue() {
        this.facets$
            .pipe(
                take(1),
                mergeMap(facets =>
                    this.modalService.fromComponent(ApplyFacetDialogComponent, {
                        size: 'md',
                        locals: { facets },
                    }),
                ),
                map(facetValues => facetValues && facetValues.map(v => v.id)),
                withLatestFrom(this.entity$),
            )
            .subscribe(([facetValueIds, category]) => {
                if (facetValueIds) {
                    const existingFacetValueIds = this.detailForm.value.facetValueIds;
                    this.detailForm.patchValue({
                        facetValueIds: unique([...existingFacetValueIds, ...facetValueIds]),
                    });
                    this.detailForm.markAsDirty();
                    this.changeDetector.markForCheck();
                }
            });
    }

    removeValueFacet(id: string) {
        const facetValueIds = this.detailForm.value.facetValueIds.filter(fvid => fvid !== id);
        this.detailForm.patchValue({
            facetValueIds,
        });
        this.detailForm.markAsDirty();
    }

    create() {
        if (!this.detailForm.dirty) {
            return;
        }
        combineLatest(this.entity$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([category, languageCode]) => {
                    const input = this.getUpdatedCategory(category, this.detailForm, languageCode);
                    return this.dataService.product.createCollection(input);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-create-success'), {
                        entity: 'ProductCategory',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                    this.router.navigate(['../', data.createCollection.id], { relativeTo: this.route });
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
                    const input = this.getUpdatedCategory(
                        category,
                        this.detailForm,
                        languageCode,
                    ) as UpdateCollectionInput;
                    return this.dataService.product.updateCollection(input);
                }),
            )
            .subscribe(
                () => {
                    this.detailForm.markAsPristine();
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
    protected setFormValues(category: Collection.Fragment, languageCode: LanguageCode) {
        const currentTranslation = category.translations.find(t => t.languageCode === languageCode);

        this.detailForm.patchValue({
            name: currentTranslation ? currentTranslation.name : '',
            description: currentTranslation ? currentTranslation.description : '',
            facetValueIds: category.facetValues.map(fv => fv.id),
        });

        if (this.customFields.length) {
            const customFieldsGroup = this.detailForm.get(['customFields']) as FormGroup;

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

    /**
     * Given a category and the value of the form, this method creates an updated copy of the category which
     * can then be persisted to the API.
     */
    private getUpdatedCategory(
        category: Collection.Fragment,
        form: FormGroup,
        languageCode: LanguageCode,
    ): CreateCollectionInput | UpdateCollectionInput {
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
        return {
            ...updatedCategory,
            ...this.assetChanges,
            facetValueIds: this.detailForm.value.facetValueIds,
        };
    }
}
