import { ChangeDetectionStrategy, Component } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { EMPTY, Observable, Subject } from 'rxjs';
import { mergeMap, startWith, switchMap } from 'rxjs/operators';
import { DEFAULT_CHANNEL_CODE } from 'shared/shared-constants';

import { Channel } from '../../../common/generated-types';
import { NotificationService } from '../../../core/providers/notification/notification.service';
import { DataService } from '../../../data/providers/data.service';
import { ModalService } from '../../../shared/providers/modal/modal.service';

@Component({
    selector: 'vdr-channel-list',
    templateUrl: './channel-list.component.html',
    styleUrls: ['./channel-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelListComponent {
    channels$: Observable<Channel.Fragment[]>;
    private refresh$ = new Subject();

    constructor(
        private dataService: DataService,
        private modalService: ModalService,
        private notificationService: NotificationService,
    ) {
        this.channels$ = this.refresh$.pipe(
            startWith(1),
            switchMap(() => this.dataService.settings.getChannels().mapStream(data => data.channels)),
        );
    }

    isDefaultChannel(channelCode: string): boolean {
        return channelCode === DEFAULT_CHANNEL_CODE;
    }

    deleteChannel(id: string) {
        this.modalService
            .dialog({
                title: _('catalog.confirm-delete-channel'),
                buttons: [
                    { type: 'secondary', label: _('common.cancel') },
                    { type: 'danger', label: _('common.delete'), returnValue: true },
                ],
            })
            .pipe(
                switchMap(response => (response ? this.dataService.settings.deleteChannel(id) : EMPTY)),
                mergeMap(() => this.dataService.auth.currentUser().single$),
                // tslint:disable-next-line:no-non-null-assertion
                mergeMap(data => this.dataService.client.updateUserChannels(data.me!.channels)),
            )
            .subscribe(
                () => {
                    this.notificationService.success(_('common.notify-delete-success'), {
                        entity: 'Channel',
                    });
                    this.refresh$.next(1);
                },
                err => {
                    this.notificationService.error(_('common.notify-delete-error'), {
                        entity: 'Channel',
                    });
                },
            );
    }
}
