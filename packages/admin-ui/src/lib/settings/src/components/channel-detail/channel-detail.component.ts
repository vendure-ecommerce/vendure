import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import {
    BaseDetailComponent,
    CHANNEL_FRAGMENT,
    ChannelFragment,
    CreateChannelInput,
    CurrencyCode,
    CustomFieldConfig,
    DataService,
    GetChannelDetailDocument,
    GetSellersQuery,
    GetZoneListQuery,
    ItemOf,
    LanguageCode,
    NotificationService,
    Permission,
    ServerConfigService,
    TypedBaseDetailComponent,
    UpdateChannelInput,
} from '@vendure/admin-ui/core';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

export const GET_CHANNEL_DETAIL = gql`
    query GetChannelDetail($id: ID!) {
        channel(id: $id) {
            ...Channel
        }
    }
    ${CHANNEL_FRAGMENT}
`;

@Component({
    selector: 'vdr-channel-detail',
    templateUrl: './channel-detail.component.html',
    styleUrls: ['./channel-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelDetailComponent
    extends TypedBaseDetailComponent<typeof GetChannelDetailDocument, 'channel'>
    implements OnInit, OnDestroy
{
    customFields = this.getCustomFieldConfig('Channel');
    // zones$: Observable<Array<ItemOf<GetZoneListQuery, 'zones'>>>;
    sellers$: Observable<GetSellersQuery['sellers']['items']>;
    detailForm = this.formBuilder.group({
        code: ['', Validators.required],
        token: ['', Validators.required],
        pricesIncludeTax: [false],
        currencyCode: ['' as CurrencyCode],
        defaultShippingZoneId: ['', Validators.required],
        defaultLanguageCode: [undefined as LanguageCode | undefined],
        defaultTaxZoneId: ['', Validators.required],
        sellerId: ['', Validators.required],
        customFields: this.formBuilder.group(
            this.customFields.reduce((hash, field) => ({ ...hash, [field.name]: '' }), {}),
        ),
    });
    currencyCodes = Object.values(CurrencyCode);
    availableLanguageCodes$: Observable<LanguageCode[]>;
    readonly updatePermission = [Permission.SuperAdmin, Permission.UpdateChannel, Permission.CreateChannel];

    constructor(
        protected serverConfigService: ServerConfigService,
        private changeDetector: ChangeDetectorRef,
        protected dataService: DataService,
        private formBuilder: FormBuilder,
        private notificationService: NotificationService,
    ) {
        super();
    }

    ngOnInit() {
        this.init();
        // this.zones$ = this.dataService.settings.getZones({ take: 100 }).mapSingle(data => data.zones.items);
        // TODO: make this lazy-loaded autocomplete
        this.sellers$ = this.dataService.settings.getSellerList().mapSingle(data => data.sellers.items);
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
        const {
            code,
            token,
            defaultLanguageCode,
            pricesIncludeTax,
            currencyCode,
            defaultShippingZoneId,
            defaultTaxZoneId,
            customFields,
            sellerId,
        } = this.detailForm.value;
        if (
            !code ||
            !token ||
            !defaultLanguageCode ||
            !pricesIncludeTax ||
            !currencyCode ||
            !defaultShippingZoneId ||
            !defaultTaxZoneId
        ) {
            return;
        }
        const input: CreateChannelInput = {
            code,
            token,
            defaultLanguageCode,
            pricesIncludeTax,
            currencyCode,
            defaultShippingZoneId,
            defaultTaxZoneId,
            customFields,
            sellerId,
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
        return Array.from(crypto.getRandomValues(new Uint8Array(10))).map(b => b.toString(16).padStart(2, '0')).join('');
    }
}
