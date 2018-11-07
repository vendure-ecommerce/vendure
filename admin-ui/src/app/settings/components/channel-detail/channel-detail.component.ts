import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import {
    Channel,
    CreateChannelInput,
    GetZones,
    LanguageCode,
    UpdateChannelInput,
} from 'shared/generated-types';

import { BaseDetailComponent } from '../../../common/base-detail.component';
import { _ } from '../../../core/providers/i18n/mark-for-extraction';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ServerConfigService } from '../../../data/server-config';

@Component({
    selector: 'vdr-channel-detail',
    templateUrl: './channel-detail.component.html',
    styleUrls: ['./channel-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelDetailComponent extends BaseDetailComponent<Channel.Fragment>
    implements OnInit, OnDestroy {
    zones$: Observable<GetZones.Zones[]>;
    channelForm: FormGroup;

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
        this.channelForm = this.formBuilder.group({
            code: ['', Validators.required],
            token: ['', Validators.required],
            pricesIncludeTax: [false],
            defaultShippingZoneId: [''],
            defaultTaxZoneId: [''],
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
        return this.channelForm.dirty && this.channelForm.valid;
    }

    create() {
        if (!this.channelForm.dirty) {
            return;
        }
        const formValue = this.channelForm.value;
        const input = {
            code: formValue.code,
            pricesIncludeTax: formValue.pricesIncludeTax,
            defaultShippingZoneId: formValue.defaultShippingZoneId,
            defaultTaxZoneId: formValue.defaultTaxZoneId,
        } as CreateChannelInput;
        this.dataService.settings.createChannel(input).subscribe(
            data => {
                this.notificationService.success(_('common.notify-create-success'), {
                    entity: 'Channel',
                });
                this.channelForm.markAsPristine();
                this.changeDetector.markForCheck();
                this.router.navigate(['../', data.createChannel.id], { relativeTo: this.route });
            },
            err => {
                this.notificationService.error(_('common.notify-create-error'), {
                    entity: 'Channel',
                });
            },
        );
    }

    save() {
        if (!this.channelForm.dirty) {
            return;
        }
        const formValue = this.channelForm.value;
        this.entity$
            .pipe(
                take(1),
                mergeMap(channel => {
                    const input = {
                        id: channel.id,
                        code: formValue.code,
                        pricesIncludeTax: formValue.pricesIncludeTax,
                        defaultShippingZoneId: formValue.defaultShippingZoneId,
                        defaultTaxZoneId: formValue.defaultTaxZoneId,
                    } as UpdateChannelInput;
                    return this.dataService.settings.updateChannel(input);
                }),
            )
            .subscribe(
                data => {
                    this.notificationService.success(_('common.notify-update-success'), {
                        entity: 'Channel',
                    });
                    this.channelForm.markAsPristine();
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
        this.channelForm.patchValue({
            code: entity.code,
            token: entity.token,
            pricesIncludeTax: entity.pricesIncludeTax,
            defaultShippingZoneId: entity.defaultShippingZone ? entity.defaultShippingZone.id : '',
            defaultTaxZoneId: entity.defaultTaxZone ? entity.defaultTaxZone.id : '',
        });
    }
}
