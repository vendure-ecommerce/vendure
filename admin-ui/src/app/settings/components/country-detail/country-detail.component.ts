import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { Country, CreateCountryInput, UpdateCountryInput } from 'shared/generated-types';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ServerConfigService } from '../../../data/server-config';

@Component({
    selector: 'vdr-country-detail',
    templateUrl: './country-detail.component.html',
    styleUrls: ['./country-detail.component.scss'],
})
export class CountryDetailComponent extends BaseDetailComponent<Country> implements OnInit, OnDestroy {
    country$: Observable<Country>;
    countryForm: FormGroup;

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
        this.countryForm = this.formBuilder.group({
            code: ['', Validators.required],
            name: ['', Validators.required],
            enabled: [true],
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
        const formValue = this.countryForm.value;
        const country: CreateCountryInput = {
            code: formValue.code,
            name: formValue.name,
            enabled: formValue.enabled,
        };
        this.dataService.settings.createCountry(country).subscribe(
            data => {
                this.notificationService.success(_('common.notify-create-success'), {
                    entity: 'Country',
                });
                this.countryForm.markAsPristine();
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
        this.country$
            .pipe(
                take(1),
                mergeMap(({ id }) => {
                    const formValue = this.countryForm.value;
                    const country: UpdateCountryInput = {
                        id,
                        code: formValue.code,
                        name: formValue.name,
                        enabled: formValue.enabled,
                    };
                    return this.dataService.settings.updateCountry(country);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'Country',
                    });
                    this.countryForm.markAsPristine();
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Country',
                    });
                },
            );
    }

    protected setFormValues(country: Country): void {
        this.countryForm.patchValue({
            code: country.code,
            name: country.name,
            enabled: country.enabled,
        });
    }
}
