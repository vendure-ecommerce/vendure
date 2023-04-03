import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseDetailComponent,
    ConfigurableOperation,
    CreateTaxCategoryInput,
    CustomFieldConfig,
    DataService,
    LanguageCode,
    NotificationService,
    Permission,
    ServerConfigService,
    TaxCategoryFragment,
    UpdateTaxCategoryInput,
} from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

@Component({
    selector: 'vdr-tax-detail',
    templateUrl: './tax-category-detail.component.html',
    styleUrls: ['./tax-category-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaxCategoryDetailComponent
    extends BaseDetailComponent<TaxCategoryFragment>
    implements OnInit, OnDestroy
{
    taxCategory$: Observable<TaxCategoryFragment>;
    detailForm: UntypedFormGroup;
    customFields: CustomFieldConfig[];
    readonly updatePermission = [Permission.UpdateSettings, Permission.UpdateTaxCategory];

    private taxCondition: ConfigurableOperation;
    private taxAction: ConfigurableOperation;

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
        this.customFields = this.getCustomFieldConfig('TaxCategory');
        this.detailForm = this.formBuilder.group({
            name: ['', Validators.required],
            isDefault: false,
            customFields: this.formBuilder.group(
                this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
            ),
        });
    }

    ngOnInit() {
        this.init();
        this.taxCategory$ = this.entity$;
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
            isDefault: formValue.isDefault,
            customFields: formValue.customFields,
        } as CreateTaxCategoryInput;
        this.dataService.settings.createTaxCategory(input).subscribe(
            data => {
                this.notificationService.success(_('common.notify-create-success'), {
                    entity: 'TaxCategory',
                });
                this.detailForm.markAsPristine();
                this.changeDetector.markForCheck();
                this.router.navigate(['../', data.createTaxCategory.id], { relativeTo: this.route });
            },
            err => {
                this.notificationService.error(_('common.notify-create-error'), {
                    entity: 'TaxCategory',
                });
            },
        );
    }

    save() {
        if (!this.detailForm.dirty) {
            return;
        }
        const formValue = this.detailForm.value;
        this.taxCategory$
            .pipe(
                take(1),
                mergeMap(taxCategory => {
                    const input = {
                        id: taxCategory.id,
                        name: formValue.name,
                        isDefault: formValue.isDefault,
                        customFields: formValue.customFields,
                    } as UpdateTaxCategoryInput;
                    return this.dataService.settings.updateTaxCategory(input);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'TaxCategory',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'TaxCategory',
                    });
                },
            );
    }

    /**
     * Update the form values when the entity changes.
     */
    protected setFormValues(entity: TaxCategoryFragment, languageCode: LanguageCode): void {
        this.detailForm.patchValue({
            name: entity.name,
            isDefault: entity.isDefault,
        });
        if (this.customFields.length) {
            this.setCustomFieldFormValues(this.customFields, this.detailForm.get('customFields'), entity);
        }
    }
}
