import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseDetailComponent,
    CreateTaxRateInput,
    CustomerGroup,
    CustomFieldConfig,
    DataService,
    GetZonesQuery,
    LanguageCode,
    NotificationService,
    Permission,
    ServerConfigService,
    TaxCategoryFragment,
    TaxRate,
    TaxRateFragment,
    UpdateTaxRateInput,
} from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

@Component({
    selector: 'vdr-tax-rate-detail',
    templateUrl: './tax-rate-detail.component.html',
    styleUrls: ['./tax-rate-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxRateDetailComponent
    extends BaseDetailComponent<TaxRateFragment>
    implements OnInit, OnDestroy
{
    taxCategories$: Observable<TaxCategoryFragment[]>;
    zones$: Observable<GetZonesQuery['zones']>;
    groups$: Observable<CustomerGroup[]>;
    detailForm: UntypedFormGroup;
    customFields: CustomFieldConfig[];
    readonly updatePermission = [Permission.UpdateSettings, Permission.UpdateTaxRate];

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
        this.customFields = this.getCustomFieldConfig('TaxRate');
        this.detailForm = this.formBuilder.group({
            name: ['', Validators.required],
            enabled: [true],
            value: [0, Validators.required],
            taxCategoryId: [''],
            zoneId: [''],
            customerGroupId: [''],
            customFields: this.formBuilder.group(
                this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
            ),
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
            customFields: formValue.customFields,
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
                        customFields: formValue.customFields,
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
    protected setFormValues(entity: TaxRateFragment, languageCode: LanguageCode): void {
        this.detailForm.patchValue({
            name: entity.name,
            enabled: entity.enabled,
            value: entity.value,
            taxCategoryId: entity.category ? entity.category.id : '',
            zoneId: entity.zone ? entity.zone.id : '',
            customerGroupId: entity.customerGroup ? entity.customerGroup.id : '',
        });
        if (this.customFields.length) {
            this.setCustomFieldFormValues(this.customFields, this.detailForm.get('customFields'), entity);
        }
    }
}
