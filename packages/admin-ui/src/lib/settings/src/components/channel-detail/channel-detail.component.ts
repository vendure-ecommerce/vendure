import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { Observable } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';

import { BaseDetailComponent } from '@vendure/admin-ui/core';
import {
    Channel,
    CreateChannelInput,
    CurrencyCode,
    GetZones,
    LanguageCode,
    UpdateChannelInput,
} from '@vendure/admin-ui/core';
import { getDefaultLanguage } from '@vendure/admin-ui/core';
import { NotificationService } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';
import { ServerConfigService } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-channel-detail',
    templateUrl: './channel-detail.component.html',
    styleUrls: ['./channel-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelDetailComponent extends BaseDetailComponent<Channel.Fragment>
    implements OnInit, OnDestroy {
    zones$: Observable<GetZones.Zones[]>;
    detailForm: FormGroup;
    currencyCodes = Object.values(CurrencyCode);

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
            code: ['', Validators.required],
            token: ['', Validators.required],
            pricesIncludeTax: [false],
            currencyCode: [''],
            defaultShippingZoneId: ['', Validators.required],
            defaultTaxZoneId: ['', Validators.required],
        });
    }

    ngOnInit() {
        this.init();
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
        const input: CreateChannelInput = {
            code: formValue.code,
            token: formValue.token,
            defaultLanguageCode: getDefaultLanguage(),
            pricesIncludeTax: formValue.pricesIncludeTax,
            currencyCode: formValue.currencyCode,
            defaultShippingZoneId: formValue.defaultShippingZoneId,
            defaultTaxZoneId: formValue.defaultTaxZoneId,
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
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-create-success'), {
                        entity: 'Channel',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                    this.router.navigate(['../', data.id], { relativeTo: this.route });
                },
                err => {
                    this.notificationService.error(_('common.notify-create-error'), {
                        entity: 'Channel',
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
                mergeMap(channel => {
                    const input = {
                        id: channel.id,
                        code: formValue.code,
                        pricesIncludeTax: formValue.pricesIncludeTax,
                        currencyCode: formValue.currencyCode,
                        defaultShippingZoneId: formValue.defaultShippingZoneId,
                        defaultTaxZoneId: formValue.defaultTaxZoneId,
                    } as UpdateChannelInput;
                    return this.dataService.settings.updateChannel(input);
                }),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'Channel',
                    });
                    this.detailForm.markAsPristine();
                    this.changeDetector.markForCheck();
                },
                err => {
                    this.notificationService.error(_('common.notify-update-error'), {
                        entity: 'Channel',
                    });
                },
            );
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
            defaultTaxZoneId: entity.defaultTaxZone ? entity.defaultTaxZone.id : '',
        });
        if (entity.code === DEFAULT_CHANNEL_CODE) {
            const codeControl = this.detailForm.get('code');
            if (codeControl) {
                codeControl.disable();
            }
        }
    }

    private generateToken(): string {
        const randomString = () =>
            Math.random()
                .toString(36)
                .substr(3, 10);
        return `${randomString()}${randomString()}`;
    }
}
