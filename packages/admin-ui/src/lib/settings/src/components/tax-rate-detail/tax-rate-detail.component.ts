import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

import { BaseDetailComponent } from '@vendure/admin-ui/core';
import {
    CreateTaxRateInput,
    CustomerGroup,
    GetZones,
    LanguageCode,
    TaxCategory,
    TaxRate,
    UpdateTaxRateInput,
} from '@vendure/admin-ui/core';
import { NotificationService } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';
import { ServerConfigService } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-tax-rate-detail',
    templateUrl: './tax-rate-detail.component.html',
    styleUrls: ['./tax-rate-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxRateDetailComponent extends BaseDetailComponent<TaxRate.Fragment>
    implements OnInit, OnDestroy {
    taxCategories$: Observable<TaxCategory.Fragment[]>;
    zones$: Observable<GetZones.Zones[]>;
    groups$: Observable<CustomerGroup[]>;
    detailForm: FormGroup;

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
        this.detailForm = this.formBuilder.group({
            name: ['', Validators.required],
            enabled: [true],
            value: [0, Validators.required],
            taxCategoryId: [''],
            zoneId: [''],
            customerGroupId: [''],
        });
    }

    ngOnInit() {
        this.init();
        this.taxCategories$ = this.dataService.settings
            .getTaxCategories()
            .mapSingle(data => data.taxCategories);
        this.zones$ = this.dataService.settings.getZones().mapSingle(data => data.zones);
    }

    ngOnDestroy() {
        this.destroy();
    }

    saveButtonEnabled(): boolean {
        return this.detailForm.dirty && this.detailForm.valid;
    }

    create() {
        if (!this.detailForm.dirty) {
            return;
        }
        const formValue = this.detailForm.value;
        const input = {
            name: formValue.name,
            enabled: formValue.enabled,
            value: formValue.value,
            categoryId: formValue.taxCategoryId,
            zoneId: formValue.zoneId,
            customerGroupId: formValue.customerGroupId,
        } as CreateTaxRateInput;
        this.dataService.settings.createTaxRate(input).subscribe(
            data => {
                this.notificationService.success(_('common.notify-create-success'), {
                    entity: 'TaxRate',
                });
                this.detailForm.markAsPristine();
                this.changeDetector.markForCheck();
                this.router.navigate(['../', data.createTaxRate.id], { relativeTo: this.route });
            },
            err => {
                this.notificationService.error(_('common.notify-create-error'), {
                    entity: 'TaxRate',
                });
            },
        );
    }

    save() {
        if (!this.detailForm.dirty) {
            return;
        }
        const formValue = this.detailForm.value;
        this.entity$
            .pipe(
                take(1),
                mergeMap(taxRate => {
                    const input = {
                        id: taxRate.id,
                        name: formValue.name,
                        enabled: formValue.enabled,
                        value: formValue.value,
                        categoryId: formValue.taxCategoryId,
                        zoneId: formValue.zoneId,
                        customerGroupId: formValue.customerGroupId,
                    } as UpdateTaxRateInput;
                    return this.dataService.settings.updateTaxRate(input);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'TaxRate',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'TaxRate',
                    });
                },
            );
    }

    /**
     * Update the form values when the entity changes.
     */
    protected setFormValues(entity: TaxRate.Fragment, languageCode: LanguageCode): void {
        this.detailForm.patchValue({
            name: entity.name,
            enabled: entity.enabled,
            value: entity.value,
            taxCategoryId: entity.category ? entity.category.id : '',
            zoneId: entity.zone ? entity.zone.id : '',
            customerGroupId: entity.customerGroup ? entity.customerGroup.id : '',
        });
    }
}
