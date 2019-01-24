import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, EMPTY, forkJoin, Observable } from 'rxjs';
import { map, mergeMap, switchMap, take } from 'rxjs/operators';
import {
    CreateFacetValueInput,
    DeletionResult,
    FacetWithValues,
    LanguageCode,
    UpdateFacetValueInput,
} from 'shared/generated-types';
import { normalizeString } from 'shared/normalize-string';
import { CustomFieldConfig } from 'shared/shared-types';
import { notNullOrUndefined } from 'shared/shared-utils';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { createUpdatedTranslatable } from '../../../common/utilities/create-updated-translatable';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ServerConfigService } from '../../../data/server-config';
import { ModalService } from '../../../shared/providers/modal/modal.service';
import { DeleteFacetValueDialogComponent } from '../delete-facet-value-dialog/delete-facet-value-dialog.component';

@Component({
    selector: 'vdr-facet-detail',
    templateUrl: './facet-detail.component.html',
    styleUrls: ['./facet-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacetDetailComponent extends BaseDetailComponent<FacetWithValues.Fragment>
    implements OnInit, OnDestroy {
    facet$: Observable<FacetWithValues.Fragment>;
    values$: Observable<FacetWithValues.Values[]>;
    customFields: CustomFieldConfig[];
    customValueFields: CustomFieldConfig[];
    detailForm: FormGroup;

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
                customFields: this.formBuilder.group(
                    this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
                ),
            }),
            values: this.formBuilder.array([]),
        });
    }

    ngOnInit() {
        this.init();
        this.facet$ = this.entity$;
        this.values$ = this.facet$.pipe(map(facet => facet.values));
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
            valuesFormArray.insert(valuesFormArray.length, this.formBuilder.group({ name: '', code: '' }));
        }
    }

    create() {
        const facetForm = this.detailForm.get('facet');
        if (!facetForm || !facetForm.dirty) {
            return;
        }
        combineLatest(this.facet$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([facet, languageCode]) => {
                    const newFacet = this.getUpdatedFacet(facet, facetForm as FormGroup, languageCode);
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
        combineLatest(this.facet$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([facet, languageCode]) => {
                    const facetGroup = this.detailForm.get('facet');
                    const updateOperations: Array<Observable<any>> = [];

                    if (facetGroup && facetGroup.dirty) {
                        const newFacet = this.getUpdatedFacet(facet, facetGroup as FormGroup, languageCode);
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
                            updateOperations.push(this.dataService.facet.createFacetValues(newValues));
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

    deleteFacetValue(facetValueId: string) {
        this.showDeleteFacetValueModalAndDelete(facetValueId)
            .pipe(
                switchMap(response => {
                    if (response.deleteFacetValues[0].result === DeletionResult.DELETED) {
                        return [true];
                    } else {
                        return this.showDeleteFacetValueModalAndDelete(
                            facetValueId,
                            response.deleteFacetValues[0].message || '',
                        ).pipe(map(r => r.deleteFacetValues[0].result === DeletionResult.DELETED));
                    }
                }),
                switchMap(deleted => {
                    if (deleted) {
                        return this.dataService.facet.getFacet(this.id).single$;
                    } else {
                        return [];
                    }
                }),
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

    private showDeleteFacetValueModalAndDelete(facetValueId: string, message?: string) {
        return this.modalService
            .fromComponent(DeleteFacetValueDialogComponent, {
                locals: {
                    message,
                },
            })
            .pipe(
                switchMap(result => {
                    if (result) {
                        return this.dataService.facet.deleteFacetValues([facetValueId], !!message);
                    }
                    return EMPTY;
                }),
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

        const valuesFormArray = this.detailForm.get('values') as FormArray;
        facet.values.forEach((value, i) => {
            const valueTranslation = value.translations.find(t => t.languageCode === languageCode);
            const group = {
                id: value.id,
                code: value.code,
                name: valueTranslation ? valueTranslation.name : '',
            };
            const existing = valuesFormArray.at(i);
            if (existing) {
                existing.patchValue(group);
            } else {
                valuesFormArray.insert(i, this.formBuilder.group(group));
            }
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
    ): any {
        return createUpdatedTranslatable({
            translatable: facet,
            updatedFields: facetFormGroup.value,
            customFieldConfig: this.customFields,
            languageCode,
            defaultTranslation: {
                languageCode,
                name: facet.name || '',
            },
        });
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
