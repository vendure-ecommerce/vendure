import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, forkJoin, Observable, Subject } from 'rxjs';
import { map, mergeMap, switchMap, take, takeUntil } from 'rxjs/operators';

import { CustomFieldConfig } from '../../../../../../shared/shared-types';
import { createUpdatedTranslatable } from '../../../common/utilities/create-updated-translatable';
import { getDefaultLanguage } from '../../../common/utilities/get-default-language';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { getServerConfig } from '../../../data/server-config';
import { FacetWithValues, LanguageCode } from '../../../data/types/gql-generated-types';

@Component({
    selector: 'vdr-facet-detail',
    templateUrl: './facet-detail.component.html',
    styleUrls: ['./facet-detail.component.scss'],
})
export class FacetDetailComponent implements OnInit, OnDestroy {
    facet$: Observable<FacetWithValues>;
    availableLanguages$: Observable<LanguageCode[]>;
    customFields: CustomFieldConfig[];
    languageCode$: Observable<LanguageCode>;
    isNew$: Observable<boolean>;
    facetForm: FormGroup;
    private destroy$ = new Subject<void>();

    constructor(
        private dataService: DataService,
        private router: Router,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
    ) {}

    ngOnInit() {
        this.customFields = getServerConfig().customFields.Facet || [];
        this.facet$ = this.route.data.pipe(switchMap(data => data.facet));
        this.facetForm = this.formBuilder.group({
            facet: this.formBuilder.group({
                code: ['', Validators.required],
                name: '',
                customFields: this.formBuilder.group(
                    this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
                ),
            }),
        });

        this.isNew$ = this.facet$.pipe(map(facet => facet.id === ''));
        this.languageCode$ = this.route.queryParamMap.pipe(
            map(qpm => qpm.get('lang')),
            map(lang => (!lang ? getDefaultLanguage() : (lang as LanguageCode))),
        );

        this.availableLanguages$ = this.facet$.pipe(map(p => p.translations.map(t => t.languageCode)));

        combineLatest(this.facet$, this.languageCode$)
            .pipe(takeUntil(this.destroy$))
            .subscribe(([facet, languageCode]) => this.setFormValues(facet, languageCode));
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    setLanguage(code: LanguageCode) {
        this.setQueryParam('lang', code);
    }

    customFieldIsSet(name: string): boolean {
        return !!this.facetForm.get(['facet', 'customFields', name]);
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
                    this.notificationService.success(_('catalog.notify-create-facet-success'));
                    this.facetForm.markAsPristine();
                    this.router.navigate(['../', data.createFacet.id], { relativeTo: this.route });
                },
                err => {
                    this.notificationService.error(_('catalog.notify-create-facet-error'));
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
                    /* const variantsArray = this.facetForm.get('variants');
                    if (variantsArray && variantsArray.dirty) {
                        const newVariants = this.getUpdatedFacetValues(facet, variantsArray as FormArray, languageCode);
                        updateOperations.push(this.dataService.facet.updateFacetVariants(newVariants));
                    }*/

                    return forkJoin(updateOperations);
                }),
            )
            .subscribe(
                () => {
                    this.facetForm.markAsPristine();
                    this.notificationService.success(_('catalog.notify-update-facet-success'));
                },
                err => {
                    this.notificationService.error(_('catalog.notify-update-facet-error'), {
                        error: err.message,
                    });
                },
            );
    }

    /**
     * Sets the values of the form on changes to the facet or current language.
     */
    private setFormValues(facet: FacetWithValues, languageCode: LanguageCode) {
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
        }
    }

    /**
     * Given a facet and the value of the facetForm, this method creates an updated copy of the facet which
     * can then be persisted to the API.
     */
    private getUpdatedFacet(
        facet: FacetWithValues,
        facetFormGroup: FormGroup,
        languageCode: LanguageCode,
    ): any {
        return createUpdatedTranslatable(facet, facetFormGroup.value, this.customFields, languageCode, {
            languageCode,
            name: facet.name || '',
        });
    }

    private setQueryParam(key: string, value: any) {
        this.router.navigate(['./'], {
            queryParams: { [key]: value },
            relativeTo: this.route,
            queryParamsHandling: 'merge',
        });
    }
}
