import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { BaseDetailComponent, CustomFieldConfig } from '@vendure/admin-ui/core';
import {
    Channel,
    CreateChannelInput,
    CurrencyCode,
    GetZones,
    LanguageCode,
    UpdateChannelInput,
} from '@vendure/admin-ui/core';
import { getDefaultUiLanguage } from '@vendure/admin-ui/core';
import { NotificationService } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';
import { ServerConfigService } from '@vendure/admin-ui/core';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';
@Component({
    selector: 'vdr-channel-detail',
    templateUrl: './channel-detail.component.html',
    styleUrls: ['./channel-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelDetailComponent
    extends BaseDetailComponent<Channel.Fragment>
    implements OnInit, OnDestroy {
    customFields: CustomFieldConfig[];
    zones$: Observable<GetZones.Zones[]>;
    detailForm: FormGroup;
    currencyCodes = Object.values(CurrencyCode);
    availableLanguageCodes$: Observable<LanguageCode[]>;

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
        this.customFields = this.getCustomFieldConfig('Channel');
        this.detailForm = this.formBuilder.group({
            code: ['', Validators.required],
            token: ['', Validators.required],
            pricesIncludeTax: [false],
            currencyCode: [''],
            defaultShippingZoneId: ['', Validators.required],
            defaultLanguageCode: [],
            defaultTaxZoneId: ['', Validators.required],
            customFields: this.formBuilder.group(
                this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
            ),
        });
    }

    ngOnInit() {
        this.init();
        this.zones$ = this.dataService.settings.getZones().mapSingle(data => data.zones);
        this.availableLanguageCodes$ = this.serverConfigService.getAvailableLanguages();
    }

    ngOnDestroy() {
        this.destroy();
    }

    customFieldIsSet(name: string): boolean {
        return !!this.detailForm.get(['customFields', name]);
    }

    saveButtonEnabled(): boolean {
        return this.detailForm.dirty && this.detailForm.valid;
    }

    create() {
        if (!this.detailForm.dirty) {
            return;
        }
        const formValue = this.detailForm.value;
        const input: CreateChannelInput = {
            code: formValue.code,
            token: formValue.token,
            defaultLanguageCode: formValue.defaultLanguageCode,
            pricesIncludeTax: formValue.pricesIncludeTax,
            currencyCode: formValue.currencyCode,
            defaultShippingZoneId: formValue.defaultShippingZoneId,
            defaultTaxZoneId: formValue.defaultTaxZoneId,
            customFields: formValue.customFields,
        };
        this.dataService.settings
            .createChannel(input)
            .pipe(
                mergeMap(({ createChannel }) =>
                    this.dataService.auth.currentUser().single$.pipe(
                        map(({ me }) => ({
                            me,
                            createChannel,
                        })),
                    ),
                ),
                mergeMap(({ me, createChannel }) =>
                    // tslint:disable-next-line:no-non-null-assertion
                    this.dataService.client.updateUserChannels(me!.channels).pipe(map(() => createChannel)),
                ),
            )
            .subscribe(data => {
                switch (data.__typename) {
                    case 'Channel':
                        this.notificationService.success(_('common.notify-create-success'), {
                            entity: 'Channel',
                        });
                        this.detailForm.markAsPristine();
                        this.changeDetector.markForCheck();
                        this.router.navigate(['../', data.id], { relativeTo: this.route });
                        break;
                    case 'LanguageNotAvailableError':
                        this.notificationService.error(data.message);
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
                mergeMap(channel => {
                    const input = {
                        id: channel.id,
                        code: formValue.code,
                        pricesIncludeTax: formValue.pricesIncludeTax,
                        currencyCode: formValue.currencyCode,
                        defaultShippingZoneId: formValue.defaultShippingZoneId,
                        defaultLanguageCode: formValue.defaultLanguageCode,
                        defaultTaxZoneId: formValue.defaultTaxZoneId,
                        customFields: formValue.customFields,
                    } as UpdateChannelInput;
                    return this.dataService.settings.updateChannel(input);
                }),
            )
            .subscribe(({ updateChannel }) => {
                switch (updateChannel.__typename) {
                    case 'Channel':
                        this.notificationService.success(_('common.notify-update-success'), {
                            entity: 'Channel',
                        });
                        this.detailForm.markAsPristine();
                        this.changeDetector.markForCheck();
                        break;
                    case 'LanguageNotAvailableError':
                        this.notificationService.error(updateChannel.message);
                }
            });
    }

    /**
     * Update the form values when the entity changes.
     */
    protected setFormValues(entity: Channel.Fragment, languageCode: LanguageCode): void {
        this.detailForm.patchValue({
            code: entity.code,
            token: entity.token || this.generateToken(),
            pricesIncludeTax: entity.pricesIncludeTax,
            currencyCode: entity.currencyCode,
            defaultShippingZoneId: entity.defaultShippingZone ? entity.defaultShippingZone.id : '',
            defaultLanguageCode: entity.defaultLanguageCode,
            defaultTaxZoneId: entity.defaultTaxZone ? entity.defaultTaxZone.id : '',
        });
        if (this.customFields.length) {
            const customFieldsGroup = this.detailForm.get('customFields') as FormGroup;

            for (const fieldDef of this.customFields) {
                const key = fieldDef.name;
                const value = (entity as any).customFields[key];
                const control = customFieldsGroup.get(key);
                if (control) {
                    control.patchValue(value);
                }
            }
        }
        if (entity.code === DEFAULT_CHANNEL_CODE) {
            const codeControl = this.detailForm.get('code');
            if (codeControl) {
                codeControl.disable();
            }
        }
    }

    private generateToken(): string {
        const randomString = () => Math.random().toString(36).substr(3, 10);
        return `${randomString()}${randomString()}`;
    }
}
