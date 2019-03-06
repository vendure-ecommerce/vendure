import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, Observable } from 'rxjs';
import { mergeMap, shareReplay, take } from 'rxjs/operators';
import {
    Collection,
    ConfigurableOperation,
    ConfigurableOperationInput,
    CreateCollectionInput,
    FacetWithValues,
    LanguageCode,
    UpdateCollectionInput,
} from 'shared/generated-types';
import { CustomFieldConfig } from 'shared/shared-types';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { createUpdatedTranslatable } from '../../../common/utilities/create-updated-translatable';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ServerConfigService } from '../../../data/server-config';
import { ModalService } from '../../../shared/providers/modal/modal.service';

@Component({
    selector: 'vdr-collection-detail',
    templateUrl: './collection-detail.component.html',
    styleUrls: ['./collection-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionDetailComponent extends BaseDetailComponent<Collection.Fragment>
    implements OnInit, OnDestroy {
    customFields: CustomFieldConfig[];
    detailForm: FormGroup;
    assetChanges: { assetIds?: string[]; featuredAssetId?: string } = {};
    filters: ConfigurableOperation[] = [];
    allFilters: ConfigurableOperation[] = [];
    facets$: Observable<FacetWithValues.Fragment[]>;

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
            filters: this.formBuilder.array([]),
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

        this.dataService.product.getCollectionFilters().single$.subscribe(res => {
            this.allFilters = res.collectionFilters;
        });
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

    addFilter(collectionFilter: ConfigurableOperation) {
        const filtersArray = this.detailForm.get('filters') as FormArray;
        const index = filtersArray.value.findIndex(o => o.code === collectionFilter.code);
        if (index === -1) {
            const argsHash = collectionFilter.args.reduce(
                (output, arg) => ({
                    ...output,
                    [arg.name]: arg.value,
                }),
                {},
            );
            filtersArray.push(
                this.formBuilder.control({
                    code: collectionFilter.code,
                    args: argsHash,
                }),
            );
            this.filters.push(collectionFilter);
        }
    }

    removeFilter(collectionFilter: ConfigurableOperation) {
        const filtersArray = this.detailForm.get('filters') as FormArray;
        const index = filtersArray.value.findIndex(o => o.code === collectionFilter.code);
        if (index !== -1) {
            filtersArray.removeAt(index);
            this.filters.splice(index, 1);
        }
    }

    create() {
        if (!this.detailForm.dirty) {
            return;
        }
        combineLatest(this.entity$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([category, languageCode]) => {
                    const input = this.getUpdatedCollection(category, this.detailForm, languageCode);
                    return this.dataService.product.createCollection(input);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-create-success'), {
                        entity: 'Collection',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                    this.router.navigate(['../', data.createCollection.id], { relativeTo: this.route });
                },
                err => {
                    this.notificationService.error(_('common.notify-create-error'), {
                        entity: 'Collection',
                    });
                },
            );
    }

    save() {
        combineLatest(this.entity$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([category, languageCode]) => {
                    const input = this.getUpdatedCollection(
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
                        entity: 'Collection',
                    });
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Collection',
                    });
                },
            );
    }

    /**
     * Sets the values of the form on changes to the category or current language.
     */
    protected setFormValues(entity: Collection.Fragment, languageCode: LanguageCode) {
        const currentTranslation = entity.translations.find(t => t.languageCode === languageCode);

        this.detailForm.patchValue({
            name: currentTranslation ? currentTranslation.name : '',
            description: currentTranslation ? currentTranslation.description : '',
        });

        entity.filters.forEach(f => this.addFilter(f));

        if (this.customFields.length) {
            const customFieldsGroup = this.detailForm.get(['customFields']) as FormGroup;

            for (const fieldDef of this.customFields) {
                const key = fieldDef.name;
                const value =
                    fieldDef.type === 'localeString'
                        ? (currentTranslation as any).customFields[key]
                        : (entity as any).customFields[key];
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
    private getUpdatedCollection(
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
            filters: this.mapOperationsToInputs(this.filters, this.detailForm.value.filters),
        };
    }

    /**
     * Maps an array of conditions or actions to the input format expected by the GraphQL API.
     */
    private mapOperationsToInputs(
        operations: ConfigurableOperation[],
        formValueOperations: any,
    ): ConfigurableOperationInput[] {
        return operations.map((o, i) => {
            return {
                code: o.code,
                arguments: Object.values(formValueOperations[i].args).map((value, j) => ({
                    name: o.args[j].name,
                    value: value.toString(),
                    type: o.args[j].type,
                })),
            };
        });
    }
}
