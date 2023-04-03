import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseDetailComponent,
    CreateFacetInput,
    CreateFacetValueInput,
    createUpdatedTranslatable,
    CustomFieldConfig,
    DataService,
    DeletionResult,
    FacetWithValuesFragment,
    findTranslation,
    LanguageCode,
    ModalService,
    NotificationService,
    Permission,
    ServerConfigService,
    UpdateFacetInput,
    UpdateFacetValueInput,
} from '@vendure/admin-ui/core';
import { normalizeString } from '@vendure/common/lib/normalize-string';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { combineLatest, EMPTY, forkJoin, Observable } from 'rxjs';
import { map, mapTo, mergeMap, switchMap, take } from 'rxjs/operators';

@Component({
    selector: 'vdr-facet-detail',
    templateUrl: './facet-detail.component.html',
    styleUrls: ['./facet-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacetDetailComponent
    extends BaseDetailComponent<FacetWithValuesFragment>
    implements OnInit, OnDestroy
{
    customFields: CustomFieldConfig[];
    customValueFields: CustomFieldConfig[];
    detailForm: UntypedFormGroup;
    values: Array<FacetWithValuesFragment['values'][number] | { name: string; code: string }>;
    readonly updatePermission = [Permission.UpdateCatalog, Permission.UpdateFacet];

    constructor(
        router: Router,
        route: ActivatedRoute,
        serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        protected dataService: DataService,
        private formBuilder: UntypedFormBuilder,
        private notificationService: NotificationService,
        private modalService: ModalService,
    ) {
        super(route, router, serverConfigService, dataService);
        this.customFields = this.getCustomFieldConfig('Facet');
        this.customValueFields = this.getCustomFieldConfig('FacetValue');
        this.detailForm = this.formBuilder.group({
            facet: this.formBuilder.group({
                code: ['', Validators.required],
                name: '',
                visible: true,
                customFields: this.formBuilder.group(
                    this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
                ),
            }),
            values: this.formBuilder.array([]),
        });
    }

    ngOnInit() {
        this.init();
    }

    ngOnDestroy() {
        this.destroy();
    }

    updateCode(currentCode: string, nameValue: string) {
        if (!currentCode) {
            const codeControl = this.detailForm.get(['facet', 'code']);
            if (codeControl && codeControl.pristine) {
                codeControl.setValue(normalizeString(nameValue, '-'));
            }
        }
    }

    updateValueCode(currentCode: string, nameValue: string, index: number) {
        if (!currentCode) {
            const codeControl = this.detailForm.get(['values', index, 'code']);
            if (codeControl && codeControl.pristine) {
                codeControl.setValue(normalizeString(nameValue, '-'));
            }
        }
    }

    customValueFieldIsSet(index: number, name: string): boolean {
        return !!this.detailForm.get(['values', index, 'customFields', name]);
    }

    getValuesFormArray(): UntypedFormArray {
        return this.detailForm.get('values') as UntypedFormArray;
    }

    addFacetValue() {
        const valuesFormArray = this.detailForm.get('values') as UntypedFormArray | null;
        if (valuesFormArray) {
            const valueGroup = this.formBuilder.group({
                id: '',
                name: ['', Validators.required],
                code: '',
            });
            const newValue: any = { name: '', code: '' };
            if (this.customValueFields.length) {
                const customValueFieldsGroup = new UntypedFormGroup({});
                newValue.customFields = {};

                for (const fieldDef of this.customValueFields) {
                    const key = fieldDef.name;
                    customValueFieldsGroup.addControl(key, new UntypedFormControl());
                }

                valueGroup.addControl('customFields', customValueFieldsGroup);
            }
            valuesFormArray.insert(valuesFormArray.length, valueGroup);
            this.values.push(newValue);
        }
    }

    create() {
        const facetForm = this.detailForm.get('facet');
        if (!facetForm || !facetForm.dirty) {
            return;
        }
        combineLatest(this.entity$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([facet, languageCode]) => {
                    const newFacet = this.getUpdatedFacet(
                        facet,
                        facetForm as UntypedFormGroup,
                        languageCode,
                    ) as CreateFacetInput;
                    return this.dataService.facet.createFacet(newFacet);
                }),
                switchMap(data => this.dataService.facet.getAllFacets().single$.pipe(mapTo(data))),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-create-success'), { entity: 'Facet' });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                    this.router.navigate(['../', data.createFacet.id], { relativeTo: this.route });
                },
                err => {
                    this.notificationService.error(_('common.notify-create-error'), {
                        entity: 'Facet',
                    });
                },
            );
    }

    save() {
        combineLatest(this.entity$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([facet, languageCode]) => {
                    const facetGroup = this.detailForm.get('facet');
                    const updateOperations: Array<Observable<any>> = [];

                    if (facetGroup && facetGroup.dirty) {
                        const newFacet = this.getUpdatedFacet(
                            facet,
                            facetGroup as UntypedFormGroup,
                            languageCode,
                        ) as UpdateFacetInput;
                        if (newFacet) {
                            updateOperations.push(this.dataService.facet.updateFacet(newFacet));
                        }
                    }
                    const valuesArray = this.detailForm.get('values');
                    if (valuesArray && valuesArray.dirty) {
                        const createdValues = this.getCreatedFacetValues(
                            facet,
                            valuesArray as UntypedFormArray,
                            languageCode,
                        );
                        if (createdValues.length) {
                            updateOperations.push(
                                this.dataService.facet
                                    .createFacetValues(createdValues)
                                    .pipe(switchMap(() => this.dataService.facet.getFacet(this.id).single$)),
                            );
                        }
                        const updatedValues = this.getUpdatedFacetValues(
                            facet,
                            valuesArray as UntypedFormArray,
                            languageCode,
                        );
                        if (updatedValues.length) {
                            updateOperations.push(this.dataService.facet.updateFacetValues(updatedValues));
                        }
                    }

                    return forkJoin(updateOperations);
                }),
                switchMap(() => this.dataService.facet.getAllFacets().single$),
            )
            .subscribe(
                () => {
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                    this.notificationService.success(_('common.notify-update-success'), { entity: 'Facet' });
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Facet',
                    });
                },
            );
    }

    deleteFacetValue(facetValueId: string | undefined, index: number) {
        if (!facetValueId) {
            // deleting a newly-added (not persisted) FacetValue
            const valuesFormArray = this.detailForm.get('values') as UntypedFormArray | null;
            if (valuesFormArray) {
                valuesFormArray.removeAt(index);
            }
            this.values.splice(index, 1);
            return;
        }
        this.showModalAndDelete(facetValueId)
            .pipe(
                switchMap(response => {
                    if (response.result === DeletionResult.DELETED) {
                        return [true];
                    } else {
                        return this.showModalAndDelete(facetValueId, response.message || '').pipe(
                            map(r => r.result === DeletionResult.DELETED),
                        );
                    }
                }),
                switchMap(deleted => (deleted ? this.dataService.facet.getFacet(this.id).single$ : [])),
            )
            .subscribe(
                () => {
                    const valuesFormArray = this.detailForm.get('values') as UntypedFormArray | null;
                    if (valuesFormArray) {
                        valuesFormArray.removeAt(index);
                    }
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'FacetValue',
                    });
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'FacetValue',
                    });
                },
            );
    }

    private showModalAndDelete(facetValueId: string, message?: string) {
        return this.modalService
            .dialog({
                title: _('catalog.confirm-delete-facet-value'),
                body: message,
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(result =>
                    result ? this.dataService.facet.deleteFacetValues([facetValueId], !!message) : EMPTY,
                ),
                map(result => result.deleteFacetValues[0]),
            );
    }

    /**
     * Sets the values of the form on changes to the facet or current language.
     */
    protected setFormValues(facet: FacetWithValuesFragment, languageCode: LanguageCode) {
        const currentTranslation = findTranslation(facet, languageCode);

        this.detailForm.patchValue({
            facet: {
                code: facet.code,
                visible: !facet.isPrivate,
                name: currentTranslation?.name ?? '',
            },
        });

        if (this.customFields.length) {
            const customFieldsGroup = this.detailForm.get(['facet', 'customFields']) as UntypedFormGroup;
            this.setCustomFieldFormValues(
                this.customFields,
                this.detailForm.get(['facet', 'customFields']),
                facet,
                currentTranslation,
            );
        }

        const currentValuesFormArray = this.detailForm.get('values') as UntypedFormArray;
        this.values = [...facet.values];
        facet.values.forEach(value => {
            const valueTranslation = findTranslation(value, languageCode);
            const group = {
                id: value.id,
                code: value.code,
                name: valueTranslation ? valueTranslation.name : '',
            };
            let valueControl = currentValuesFormArray.controls.find(
                control => control.value.id === value.id,
            ) as UntypedFormGroup | undefined;
            if (valueControl) {
                valueControl.get('id')?.setValue(group.id);
                valueControl.get('code')?.setValue(group.code);
                valueControl.get('name')?.setValue(group.name);
            } else {
                valueControl = this.formBuilder.group(group);
                currentValuesFormArray.push(valueControl);
            }
            if (this.customValueFields.length) {
                let customValueFieldsGroup = valueControl.get(['customFields']) as
                    | UntypedFormGroup
                    | undefined;
                if (!customValueFieldsGroup) {
                    customValueFieldsGroup = new UntypedFormGroup({});
                    valueControl.addControl('customFields', customValueFieldsGroup);
                }

                if (customValueFieldsGroup) {
                    for (const fieldDef of this.customValueFields) {
                        const key = fieldDef.name;
                        const fieldValue =
                            fieldDef.type === 'localeString'
                                ? (valueTranslation as any | undefined)?.customFields?.[key]
                                : (value as any).customFields[key];
                        const control = customValueFieldsGroup.get(key);
                        if (control) {
                            control.setValue(fieldValue);
                        } else {
                            customValueFieldsGroup.addControl(key, new UntypedFormControl(fieldValue));
                        }
                    }
                }
            }
        });
    }

    /**
     * Given a facet and the value of the detailForm, this method creates an updated copy of the facet which
     * can then be persisted to the API.
     */
    private getUpdatedFacet(
        facet: FacetWithValuesFragment,
        facetFormGroup: UntypedFormGroup,
        languageCode: LanguageCode,
    ): CreateFacetInput | UpdateFacetInput {
        const input = createUpdatedTranslatable({
            translatable: facet,
            updatedFields: facetFormGroup.value,
            customFieldConfig: this.customFields,
            languageCode,
            defaultTranslation: {
                languageCode,
                name: facet.name || '',
            },
        });
        input.isPrivate = !facetFormGroup.value.visible;
        return input;
    }

    /**
     * Given an array of facet values and the values from the detailForm, this method creates a new array
     * which can be persisted to the API via a createFacetValues mutation.
     */
    private getCreatedFacetValues(
        facet: FacetWithValuesFragment,
        valuesFormArray: UntypedFormArray,
        languageCode: LanguageCode,
    ): CreateFacetValueInput[] {
        return valuesFormArray.controls
            .filter(c => !c.value.id)
            .map(c => c.value)
            .map(value =>
                createUpdatedTranslatable({
                    translatable: { ...value, translations: [] as any },
                    updatedFields: value,
                    customFieldConfig: this.customValueFields,
                    languageCode,
                    defaultTranslation: {
                        languageCode,
                        name: '',
                    },
                }),
            )
            .map(input => ({
                facetId: facet.id,
                ...input,
            }));
    }

    /**
     * Given an array of facet values and the values from the detailForm, this method creates a new array
     * which can be persisted to the API via an updateFacetValues mutation.
     */
    private getUpdatedFacetValues(
        facet: FacetWithValuesFragment,
        valuesFormArray: UntypedFormArray,
        languageCode: LanguageCode,
    ): UpdateFacetValueInput[] {
        const dirtyValues = facet.values.filter((v, i) => {
            const formRow = valuesFormArray.get(i.toString());
            return formRow && formRow.dirty && formRow.value.id;
        });
        const dirtyValueValues = valuesFormArray.controls
            .filter(c => c.dirty && c.value.id)
            .map(c => c.value);

        if (dirtyValues.length !== dirtyValueValues.length) {
            throw new Error(_(`error.facet-value-form-values-do-not-match`));
        }
        return dirtyValues
            .map((value, i) => createUpdatedTranslatable({
                    translatable: value,
                    updatedFields: dirtyValueValues[i],
                    customFieldConfig: this.customValueFields,
                    languageCode,
                    defaultTranslation: {
                        languageCode,
                        name: '',
                    },
                }))
            .filter(notNullOrUndefined);
    }
}
