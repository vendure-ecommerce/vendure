import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseDetailComponent,
    Collection,
    ConfigurableOperation,
    ConfigurableOperationDefinition,
    ConfigurableOperationInput,
    CreateCollectionInput,
    createUpdatedTranslatable,
    CustomFieldConfig,
    DataService,
    FacetWithValues,
    GetActiveChannel,
    LanguageCode,
    ModalService,
    NotificationService,
    ServerConfigService,
    UpdateCollectionInput,
} from '@vendure/admin-ui/core';
import { combineLatest, Observable } from 'rxjs';
import { mergeMap, shareReplay, take } from 'rxjs/operators';

import { CollectionContentsComponent } from '../collection-contents/collection-contents.component';

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
    allFilters: ConfigurableOperationDefinition[] = [];
    facets$: Observable<FacetWithValues.Fragment[]>;
    activeChannel$: Observable<GetActiveChannel.ActiveChannel>;
    @ViewChild('collectionContents') contentsComponent: CollectionContentsComponent;

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
            visible: false,
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

        this.dataService.collection.getCollectionFilters().single$.subscribe(res => {
            this.allFilters = res.collectionFilters;
        });
        this.activeChannel$ = this.dataService.settings
            .getActiveChannel()
            .mapStream(data => data.activeChannel);
    }

    ngOnDestroy() {
        this.destroy();
    }

    getFilterDefinition(filter: ConfigurableOperation): ConfigurableOperationDefinition | undefined {
        return this.allFilters.find(f => f.code === filter.code);
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
                    const input = this.getUpdatedCollection(
                        category,
                        this.detailForm,
                        languageCode,
                    ) as CreateCollectionInput;
                    const parentId = this.route.snapshot.paramMap.get('parentId');
                    if (parentId) {
                        input.parentId = parentId;
                    }
                    return this.dataService.collection.createCollection(input);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-create-success'), {
                        entity: 'Collection',
                    });
                    this.assetChanges = {};
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
                    return this.dataService.collection.updateCollection(input);
                }),
            )
            .subscribe(
                () => {
                    this.assetChanges = {};
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'Collection',
                    });
                    this.contentsComponent.refresh();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Collection',
                    });
                },
            );
    }

    canDeactivate(): boolean {
        return super.canDeactivate() && !this.assetChanges.assetIds && !this.assetChanges.featuredAssetId;
    }

    /**
     * Sets the values of the form on changes to the category or current language.
     */
    protected setFormValues(entity: Collection.Fragment, languageCode: LanguageCode) {
        const currentTranslation = entity.translations.find(t => t.languageCode === languageCode);

        this.detailForm.patchValue({
            name: currentTranslation ? currentTranslation.name : '',
            description: currentTranslation ? currentTranslation.description : '',
            visible: !entity.isPrivate,
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
            isPrivate: !form.value.visible,
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
                arguments: Object.values(formValueOperations[i].args).map((value: any, j) => ({
                    name: o.args[j].name,
                    value: value.toString(),
                    type: o.args[j].type,
                })),
            };
        });
    }
}
