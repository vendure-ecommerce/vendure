import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
    FacetWithValues,
    LanguageCode,
    ModalService,
    NotificationService,
    ServerConfigService,
    UpdateFacetInput,
    UpdateFacetValueInput,
} from '@vendure/admin-ui/core';
import { normalizeString } from '@vendure/common/lib/normalize-string';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { combineLatest, EMPTY, forkJoin, Observable } from 'rxjs';
import { map, mergeMap, switchMap, take } from 'rxjs/operators';

@Component({
    selector: 'vdr-facet-detail',
    templateUrl: './facet-detail.component.html',
    styleUrls: ['./facet-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacetDetailComponent extends BaseDetailComponent<FacetWithValues.Fragment>
    implements OnInit, OnDestroy {
    customFields: CustomFieldConfig[];
    customValueFields: CustomFieldConfig[];
    detailForm: FormGroup;
    values: Array<FacetWithValues.Values | { name: string; code: string }>;

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

    customFieldIsSet(name: string): boolean {
        return !!this.detailForm.get(['facet', 'customFields', name]);
    }

    customValueFieldIsSet(index: number, name: string): boolean {
        return !!this.detailForm.get(['values', index, 'customFields', name]);
    }

    getValuesFormArray(): FormArray {
        return this.detailForm.get('values') as FormArray;
    }

    addFacetValue() {
        const valuesFormArray = this.detailForm.get('values') as FormArray | null;
        if (valuesFormArray) {
            valuesFormArray.insert(
                valuesFormArray.length,
                this.formBuilder.group({
                    name: ['', Validators.required],
                    code: '',
                }),
            );
            this.values.push({ name: '', code: '' });
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
                        facetForm as FormGroup,
                        languageCode,
                    ) as CreateFacetInput;
                    return this.dataService.facet.createFacet(newFacet);
                }),
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
                            facetGroup as FormGroup,
                            languageCode,
                        ) as UpdateFacetInput;
                        if (newFacet) {
                            updateOperations.push(this.dataService.facet.updateFacet(newFacet));
                        }
                    }
                    const valuesArray = this.detailForm.get('values');
                    if (valuesArray && valuesArray.dirty) {
                        const newValues: CreateFacetValueInput[] = (valuesArray as FormArray).controls
                            .filter(c => !c.value.id)
                            .map(c => ({
                                facetId: facet.id,
                                code: c.value.code,
                                translations: [{ name: c.value.name, languageCode }],
                            }));
                        if (newValues.length) {
                            updateOperations.push(
                                this.dataService.facet
                                    .createFacetValues(newValues)
                                    .pipe(switchMap(() => this.dataService.facet.getFacet(this.id).single$)),
                            );
                        }
                        const updatedValues = this.getUpdatedFacetValues(
                            facet,
                            valuesArray as FormArray,
                            languageCode,
                        );
                        if (updatedValues.length) {
                            updateOperations.push(this.dataService.facet.updateFacetValues(updatedValues));
                        }
                    }

                    return forkJoin(updateOperations);
                }),
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
            const valuesFormArray = this.detailForm.get('values') as FormArray | null;
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
    protected setFormValues(facet: FacetWithValues.Fragment, languageCode: LanguageCode) {
        const currentTranslation = facet.translations.find(t => t.languageCode === languageCode);

        this.detailForm.patchValue({
            facet: {
                code: facet.code,
                visible: !facet.isPrivate,
                name: currentTranslation ? currentTranslation.name : '',
            },
        });

        if (this.customFields.length) {
            const customFieldsGroup = this.detailForm.get(['facet', 'customFields']) as FormGroup;

            for (const fieldDef of this.customFields) {
                const key = fieldDef.name;
                const value =
                    fieldDef.type === 'localeString'
                        ? (currentTranslation as any).customFields[key]
                        : (facet as any).customFields[key];
                const control = customFieldsGroup.get(key);
                if (control) {
                    control.patchValue(value);
                }
            }
        }

        const currentValuesFormArray = this.detailForm.get('values') as FormArray;
        currentValuesFormArray.clear();
        this.values = facet.values;
        facet.values.forEach((value, i) => {
            const valueTranslation =
                value.translations && value.translations.find(t => t.languageCode === languageCode);
            const group = {
                id: value.id,
                code: value.code,
                name: valueTranslation ? valueTranslation.name : '',
            };
            currentValuesFormArray.insert(i, this.formBuilder.group(group));
            if (this.customValueFields.length) {
                let customValueFieldsGroup = this.detailForm.get(['values', i, 'customFields']) as FormGroup;
                if (!customValueFieldsGroup) {
                    customValueFieldsGroup = new FormGroup({});
                    (this.detailForm.get(['values', i]) as FormGroup).addControl(
                        'customFields',
                        customValueFieldsGroup,
                    );
                }

                if (customValueFieldsGroup) {
                    for (const fieldDef of this.customValueFields) {
                        const key = fieldDef.name;
                        const fieldValue =
                            fieldDef.type === 'localeString'
                                ? (valueTranslation as any).customFields[key]
                                : (value as any).customFields[key];
                        const control = customValueFieldsGroup.get(key);
                        if (control) {
                            control.setValue(fieldValue);
                        } else {
                            customValueFieldsGroup.addControl(key, new FormControl(fieldValue));
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
        facet: FacetWithValues.Fragment,
        facetFormGroup: FormGroup,
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
     * Given an array of facet values and the values from the detailForm, this method creates an new array
     * which can be persisted to the API.
     */
    private getUpdatedFacetValues(
        facet: FacetWithValues.Fragment,
        valuesFormArray: FormArray,
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
            .map((value, i) => {
                return createUpdatedTranslatable({
                    translatable: value,
                    updatedFields: dirtyValueValues[i],
                    customFieldConfig: this.customValueFields,
                    languageCode,
                    defaultTranslation: {
                        languageCode,
                        name: '',
                    },
                });
            })
            .filter(notNullOrUndefined);
    }
}
