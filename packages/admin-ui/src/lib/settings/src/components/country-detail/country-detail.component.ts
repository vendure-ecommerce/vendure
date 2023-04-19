import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseDetailComponent,
    CountryFragment,
    CreateCountryInput,
    createUpdatedTranslatable,
    CustomFieldConfig,
    DataService,
    findTranslation,
    LanguageCode,
    NotificationService,
    Permission,
    ServerConfigService,
    UpdateCountryInput,
} from '@vendure/admin-ui/core';
import { combineLatest, Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

@Component({
    selector: 'vdr-country-detail',
    templateUrl: './country-detail.component.html',
    styleUrls: ['./country-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountryDetailComponent
    extends BaseDetailComponent<CountryFragment>
    implements OnInit, OnDestroy
{
    country$: Observable<CountryFragment>;
    detailForm: UntypedFormGroup;
    customFields: CustomFieldConfig[];
    readonly updatePermission = [Permission.UpdateSettings, Permission.UpdateCountry];

    constructor(
        router: Router,
        route: ActivatedRoute,
        serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        protected dataService: DataService,
        private formBuilder: UntypedFormBuilder,
        private notificationService: NotificationService,
    ) {
        super(route, router, serverConfigService, dataService);
        this.customFields = this.getCustomFieldConfig('Region');
        this.detailForm = this.formBuilder.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            enabled: [true],
            customFields: this.formBuilder.group(
                this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
            ),
        });
    }

    ngOnInit() {
        this.init();
        this.country$ = this.entity$;
    }

    ngOnDestroy(): void {
        this.destroy();
    }

    create() {
        if (!this.detailForm.dirty) {
            return;
        }
        combineLatest(this.country$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([country, languageCode]) => {
                    const formValue = this.detailForm.value;
                    const input: CreateCountryInput = createUpdatedTranslatable({
                        translatable: country,
                        updatedFields: formValue,
                        customFieldConfig: this.customFields,
                        languageCode,
                        defaultTranslation: {
                            name: formValue.name,
                            languageCode,
                        },
                    });
                    return this.dataService.settings.createCountry(input);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-create-success'), {
                        entity: 'Country',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                    this.router.navigate(['../', data.createCountry.id], { relativeTo: this.route });
                },
                err => {
                    this.notificationService.error(_('common.notify-create-error'), {
                        entity: 'Country',
                    });
                },
            );
    }

    save() {
        combineLatest(this.country$, this.languageCode$)
            .pipe(
                take(1),
                mergeMap(([country, languageCode]) => {
                    const formValue = this.detailForm.value;
                    const input: UpdateCountryInput = createUpdatedTranslatable({
                        translatable: country,
                        updatedFields: formValue,
                        customFieldConfig: this.customFields,
                        languageCode,
                        defaultTranslation: {
                            name: formValue.name,
                            languageCode,
                        },
                    });
                    return this.dataService.settings.updateCountry(input);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'Country',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Country',
                    });
                },
            );
    }

    protected setFormValues(country: CountryFragment, languageCode: LanguageCode): void {
        const currentTranslation = findTranslation(country, languageCode);

        this.detailForm.patchValue({
            code: country.code,
            name: currentTranslation ? currentTranslation.name : '',
            enabled: country.enabled,
        });

        if (this.customFields.length) {
            this.setCustomFieldFormValues(
                this.customFields,
                this.detailForm.get(['customFields']),
                country,
                currentTranslation,
            );
        }
    }
}
