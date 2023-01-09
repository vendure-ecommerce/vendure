import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseDetailComponent,
    CreateSellerInput,
    CurrencyCode,
    CustomFieldConfig,
    DataService,
    GetZonesQuery,
    LanguageCode,
    NotificationService,
    Permission,
    SellerFragment,
    ServerConfigService,
    UpdateSellerInput,
} from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';

@Component({
    selector: 'vdr-seller-detail',
    templateUrl: './seller-detail.component.html',
    styleUrls: ['./seller-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SellerDetailComponent extends BaseDetailComponent<SellerFragment> implements OnInit, OnDestroy {
    customFields: CustomFieldConfig[];
    zones$: Observable<GetZonesQuery['zones']>;
    detailForm: FormGroup;
    currencyCodes = Object.values(CurrencyCode);
    availableLanguageCodes$: Observable<LanguageCode[]>;
    readonly updatePermission = [Permission.SuperAdmin, Permission.UpdateSeller, Permission.CreateSeller];

    constructor(
        router: Router,
        route: ActivatedRoute,
        protected serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        protected dataService: DataService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
    ) {
        super(route, router, serverConfigService, dataService);
        this.customFields = this.getCustomFieldConfig('Seller');
        this.detailForm = this.formBuilder.group({
            name: ['', Validators.required],
            customFields: this.formBuilder.group(
                this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
            ),
        });
    }

    ngOnInit() {
        this.init();
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
        const input: CreateSellerInput = {
            name: formValue.name,
            customFields: formValue.customFields,
        };
        this.dataService.settings.createSeller(input).subscribe(data => {
            switch (data.createSeller.__typename) {
                case 'Seller':
                    this.notificationService.success(_('common.notify-create-success'), {
                        entity: 'Seller',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                    this.router.navigate(['../', data.createSeller.id], { relativeTo: this.route });
                    break;
            }
        });
    }

    save() {
        if (!this.detailForm.dirty) {
            return;
        }
        const formValue = this.detailForm.value;
        this.entity$
            .pipe(
                take(1),
                mergeMap(seller => {
                    const input = {
                        id: seller.id,
                        name: formValue.name,
                        customFields: formValue.customFields,
                    } as UpdateSellerInput;
                    return this.dataService.settings.updateSeller(input);
                }),
            )
            .subscribe(({ updateSeller }) => {
                switch (updateSeller.__typename) {
                    case 'Seller':
                        this.notificationService.success(_('common.notify-update-success'), {
                            entity: 'Seller',
                        });
                        this.detailForm.markAsPristine();
                        this.changeDetector.markForCheck();
                        break;
                    // case 'LanguageNotAvailableError':
                    //     this.notificationService.error(updateSeller.message);
                }
            });
    }

    /**
     * Update the form values when the entity changes.
     */
    protected setFormValues(entity: SellerFragment, languageCode: LanguageCode): void {
        this.detailForm.patchValue({
            name: entity.name,
        });
        if (this.customFields.length) {
            this.setCustomFieldFormValues(this.customFields, this.detailForm.get(['customFields']), entity);
        }
    }
}
