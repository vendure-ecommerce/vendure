import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, forkJoin, Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
import {
    CreateFacetValueInput,
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
    facetForm: FormGroup;

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
        this.customFields = this.getCustomFieldConfig('Facet');
        this.customValueFields = this.getCustomFieldConfig('FacetValue');
        this.facetForm = this.formBuilder.group({
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

    updateCode(nameValue: string) {
        const codeControl = this.facetForm.get(['facet', 'code']);
        if (codeControl && codeControl.pristine) {
            codeControl.setValue(normalizeString(nameValue, '-'));
        }
    }

    updateValueCode(nameValue: string, index: number) {
        const codeControl = this.facetForm.get(['values', index, 'code']);
        if (codeControl && codeControl.pristine) {
            codeControl.setValue(normalizeString(nameValue, '-'));
        }
    }

    setLanguage(code: LanguageCode) {
        this.setQueryParam('lang', code);
    }

    customFieldIsSet(name: string): boolean {
        return !!this.facetForm.get(['facet', 'customFields', name]);
    }

    customValueFieldIsSet(index: number, name: string): boolean {
        return !!this.facetForm.get(['values', index, 'customFields', name]);
    }

    getValuesFormArray(): FormArray {
        return this.facetForm.get('values') as FormArray;
    }

    addFacetValue() {
        const valuesFormArray = this.facetForm.get('values') as FormArray | null;
        if (valuesFormArray) {
            valuesFormArray.insert(valuesFormArray.length, this.formBuilder.group({ name: '', code: '' }));
        }
    }

    create() {
        const facetForm = this.facetForm.get('facet');
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
                    this.facetForm.markAsPristine();
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
                    const facetGroup = this.facetForm.get('facet');
                    const updateOperations: Array<Observable<any>> = [];

                    if (facetGroup && facetGroup.dirty) {
                        const newFacet = this.getUpdatedFacet(facet, facetGroup as FormGroup, languageCode);
                        if (newFacet) {
                            updateOperations.push(this.dataService.facet.updateFacet(newFacet));
                        }
                    }
                    const valuesArray = this.facetForm.get('values');
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
                    this.facetForm.markAsPristine();
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

    /**
     * Sets the values of the form on changes to the facet or current language.
     */
    protected setFormValues(facet: FacetWithValues.Fragment, languageCode: LanguageCode) {
        const currentTranslation = facet.translations.find(t => t.languageCode === languageCode);
        if (currentTranslation) {
            this.facetForm.patchValue({
                facet: {
                    code: facet.code,
                    name: currentTranslation.name,
                },
            });

            if (this.customFields.length) {
                const customFieldsGroup = this.facetForm.get(['facet', 'customFields']) as FormGroup;

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

            const valuesFormArray = this.facetForm.get('values') as FormArray;
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
                    let customValueFieldsGroup = this.facetForm.get([
                        'values',
                        i,
                        'customFields',
                    ]) as FormGroup;
                    if (!customValueFieldsGroup) {
                        customValueFieldsGroup = new FormGroup({});
                        (this.facetForm.get(['values', i]) as FormGroup).addControl(
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
    }

    /**
     * Given a facet and the value of the facetForm, this method creates an updated copy of the facet which
     * can then be persisted to the API.
     */
    private getUpdatedFacet(
        facet: FacetWithValues.Fragment,
        facetFormGroup: FormGroup,
        languageCode: LanguageCode,
    ): any {
        return createUpdatedTranslatable(facet, facetFormGroup.value, this.customFields, languageCode, {
            languageCode,
            name: facet.name || '',
        });
    }

    /**
     * Given an array of facet values and the values from the facetForm, this method creates an new array
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
                return createUpdatedTranslatable(
                    value,
                    dirtyValueValues[i],
                    this.customValueFields,
                    languageCode,
                );
            })
            .filter(notNullOrUndefined);
    }
}
