import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    Asset,
    BaseDetailComponent,
    Collection,
    ConfigurableOperation,
    ConfigurableOperationDefinition,
    ConfigurableOperationInput,
    CreateCollectionInput,
    createUpdatedTranslatable,
    CustomFieldConfig,
    DataService,
    encodeConfigArgValue,
    findTranslation,
    getConfigArgValue,
    LanguageCode,
    LocalStorageService,
    ModalService,
    NotificationService,
    Permission,
    ServerConfigService,
    unicodePatternValidator,
    UpdateCollectionInput,
} from '@vendure/admin-ui/core';
import { normalizeString } from '@vendure/common/lib/normalize-string';
import { combineLatest, merge, Observable, of, Subject } from 'rxjs';
import { debounceTime, filter, map, mergeMap, switchMap, take } from 'rxjs/operators';

import { CollectionContentsComponent } from '../collection-contents/collection-contents.component';

@Component({
    selector: 'vdr-collection-detail',
    templateUrl: './collection-detail.component.html',
    styleUrls: ['./collection-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionDetailComponent
    extends BaseDetailComponent<Collection.Fragment>
    implements OnInit, OnDestroy
{
    customFields: CustomFieldConfig[];
    detailForm: FormGroup;
    assetChanges: { assets?: Asset[]; featuredAsset?: Asset } = {};
    filters: ConfigurableOperation[] = [];
    allFilters: ConfigurableOperationDefinition[] = [];
    updatedFilters$: Observable<ConfigurableOperationInput[]>;
    livePreview = false;
    parentId$: Observable<string | undefined>;
    readonly updatePermission = [Permission.UpdateCatalog, Permission.UpdateCollection];
    private filterRemoved$ = new Subject<void>();
    @ViewChild('collectionContents') contentsComponent: CollectionContentsComponent;

    constructor(
        router: Router,
        route: ActivatedRoute,
        serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        protected dataService: DataService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
        private modalService: ModalService,
        private localStorageService: LocalStorageService,
    ) {
        super(route, router, serverConfigService, dataService);
        this.customFields = this.getCustomFieldConfig('Collection');
        this.detailForm = this.formBuilder.group({
            name: ['', Validators.required],
            slug: ['', unicodePatternValidator(/^[\p{Letter}0-9_-]+$/)],
            description: '',
            visible: false,
            filters: this.formBuilder.array([]),
            customFields: this.formBuilder.group(
                this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
            ),
        });
        this.livePreview = this.localStorageService.get('livePreviewCollectionContents') ?? false;
    }

    ngOnInit() {
        this.init();
        this.dataService.collection.getCollectionFilters().single$.subscribe(res => {
            this.allFilters = res.collectionFilters;
        });
        const filtersFormArray = this.detailForm.get('filters') as FormArray;
        this.updatedFilters$ = merge(filtersFormArray.statusChanges, this.filterRemoved$).pipe(
            debounceTime(200),
            filter(() => filtersFormArray.touched),
            map(() =>
                this.mapOperationsToInputs(this.filters, filtersFormArray.value).filter(_filter => {
                    // ensure all the arguments have valid values. E.g. a newly-added
                    // filter will not yet have valid values
                    for (const arg of _filter.arguments) {
                        if (arg.value === '') {
                            return false;
                        }
                    }
                    return true;
                }),
            ),
        );
        this.parentId$ = this.route.paramMap.pipe(
            map(pm => pm.get('parentId') || undefined),
            switchMap(parentId => {
                if (parentId) {
                    return of(parentId);
                } else {
                    return this.entity$.pipe(map(collection => collection.parent?.id));
                }
            }),
        );
    }

    ngOnDestroy() {
        this.destroy();
    }

    getFilterDefinition(_filter: ConfigurableOperation): ConfigurableOperationDefinition | undefined {
        return this.allFilters.find(f => f.code === _filter.code);
    }

    assetsChanged(): boolean {
        return !!Object.values(this.assetChanges).length;
    }

    /**
     * If creating a new Collection, automatically generate the slug based on the collection name.
     */
    updateSlug(nameValue: string) {
        combineLatest(this.entity$, this.languageCode$)
            .pipe(take(1))
            .subscribe(([entity, languageCode]) => {
                const slugControl = this.detailForm.get(['slug']);
                const currentTranslation = findTranslation(entity, languageCode);
                const currentSlugIsEmpty = !currentTranslation || !currentTranslation.slug;
                if (slugControl && slugControl.pristine && currentSlugIsEmpty) {
                    slugControl.setValue(normalizeString(`${nameValue}`, '-'));
                }
            });
    }

    addFilter(collectionFilter: ConfigurableOperation) {
        const filtersArray = this.detailForm.get('filters') as FormArray;
        const argsHash = collectionFilter.args.reduce(
            (output, arg) => ({
                ...output,
                [arg.name]: getConfigArgValue(arg.value),
            }),
            {},
        );
        filtersArray.push(
            this.formBuilder.control({
                code: collectionFilter.code,
                args: argsHash,
            }),
        );
        this.filters.push({
            code: collectionFilter.code,
            args: collectionFilter.args.map(a => ({ name: a.name, value: getConfigArgValue(a.value) })),
        });
    }

    removeFilter(index: number) {
        const filtersArray = this.detailForm.get('filters') as FormArray;
        if (index !== -1) {
            filtersArray.removeAt(index);
            filtersArray.markAsDirty();
            filtersArray.markAsTouched();
            this.filters.splice(index, 1);
            this.filterRemoved$.next();
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
        return super.canDeactivate() && !this.assetChanges.assets && !this.assetChanges.featuredAsset;
    }

    toggleLivePreview() {
        this.livePreview = !this.livePreview;
        this.localStorageService.set('livePreviewCollectionContents', this.livePreview);
    }

    trackByFn(index: number, item: ConfigurableOperation) {
        return JSON.stringify(item);
    }

    /**
     * Sets the values of the form on changes to the category or current language.
     */
    protected setFormValues(entity: Collection.Fragment, languageCode: LanguageCode) {
        const currentTranslation = findTranslation(entity, languageCode);

        this.detailForm.patchValue({
            name: currentTranslation ? currentTranslation.name : '',
            slug: currentTranslation ? currentTranslation.slug : '',
            description: currentTranslation ? currentTranslation.description : '',
            visible: !entity.isPrivate,
        });

        const formArray = this.detailForm.get('filters') as FormArray;
        if (formArray.length !== entity.filters.length) {
            formArray.clear();
            this.filters = [];
            entity.filters.forEach(f => this.addFilter(f));
        }

        if (this.customFields.length) {
            this.setCustomFieldFormValues(
                this.customFields,
                this.detailForm.get(['customFields']),
                entity,
                currentTranslation,
            );
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
                slug: category.slug || '',
                description: category.description || '',
            },
        });
        return {
            ...updatedCategory,
            assetIds: this.assetChanges.assets?.map(a => a.id),
            featuredAssetId: this.assetChanges.featuredAsset?.id,
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
                arguments: Object.entries(formValueOperations[i].args).map(([name, value], j) => {
                    return {
                        name,
                        value: encodeConfigArgValue(value),
                    };
                }),
            };
        });
    }
}
