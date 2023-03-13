import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseDetailComponent,
    ChannelFragment,
    CreateChannelInput,
    CurrencyCode,
    CustomFieldConfig,
    DataService,
    GetSellersQuery,
    GetZonesQuery,
    LanguageCode,
    NotificationService,
    Permission,
    ServerConfigService,
    UpdateChannelInput,
} from '@vendure/admin-ui/core';
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
    extends BaseDetailComponent<ChannelFragment>
    implements OnInit, OnDestroy
{
    customFields: CustomFieldConfig[];
    zones$: Observable<GetZonesQuery['zones']>;
    sellers$: Observable<GetSellersQuery['sellers']['items']>;
    detailForm: UntypedFormGroup;
    currencyCodes = Object.values(CurrencyCode);
    availableLanguageCodes$: Observable<LanguageCode[]>;
    readonly updatePermission = [Permission.SuperAdmin, Permission.UpdateChannel, Permission.CreateChannel];

    constructor(
        router: Router,
        route: ActivatedRoute,
        protected serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        protected dataService: DataService,
        private formBuilder: UntypedFormBuilder,
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
            sellerId: ['', Validators.required],
            customFields: this.formBuilder.group(
                this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
            ),
        });
    }

    ngOnInit() {
        this.init();
        this.zones$ = this.dataService.settings.getZones().mapSingle(data => data.zones);
        // TODO: make this lazy-loaded autocomplete
        this.sellers$ = this.dataService.settings.getSellers().mapSingle(data => data.sellers.items);
        this.availableLanguageCodes$ = this.serverConfigService.getAvailableLanguages();
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
        const input: CreateChannelInput = {
            code: formValue.code,
            token: formValue.token,
            defaultLanguageCode: formValue.defaultLanguageCode,
            pricesIncludeTax: formValue.pricesIncludeTax,
            currencyCode: formValue.currencyCode,
            defaultShippingZoneId: formValue.defaultShippingZoneId,
            defaultTaxZoneId: formValue.defaultTaxZoneId,
            customFields: formValue.customFields,
            sellerId: formValue.sellerId,
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
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
                        token: formValue.token,
                        pricesIncludeTax: formValue.pricesIncludeTax,
                        currencyCode: formValue.currencyCode,
                        defaultShippingZoneId: formValue.defaultShippingZoneId,
                        defaultLanguageCode: formValue.defaultLanguageCode,
                        defaultTaxZoneId: formValue.defaultTaxZoneId,
                        customFields: formValue.customFields,
                        sellerId: formValue.sellerId,
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
    protected setFormValues(entity: ChannelFragment, languageCode: LanguageCode): void {
        this.detailForm.patchValue({
            code: entity.code,
            token: entity.token || this.generateToken(),
            pricesIncludeTax: entity.pricesIncludeTax,
            currencyCode: entity.currencyCode,
            defaultShippingZoneId: entity.defaultShippingZone?.id ?? '',
            defaultLanguageCode: entity.defaultLanguageCode,
            defaultTaxZoneId: entity.defaultTaxZone?.id ?? '',
            sellerId: entity.seller?.id ?? '',
        });
        if (this.customFields.length) {
            this.setCustomFieldFormValues(this.customFields, this.detailForm.get(['customFields']), entity);
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
