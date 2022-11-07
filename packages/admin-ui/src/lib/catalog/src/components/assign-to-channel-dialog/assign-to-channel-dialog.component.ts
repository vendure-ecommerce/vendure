import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DataService, Dialog, GetChannels, NotificationService } from '@vendure/admin-ui/core';
import { combineLatest } from 'rxjs';

@Component({
    selector: 'vdr-assign-to-channel-dialog',
    templateUrl: './assign-to-channel-dialog.component.html',
    styleUrls: ['./assign-to-channel-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignToChannelDialogComponent implements OnInit, Dialog<GetChannels.Channels> {
    selectedChannel: GetChannels.Channels | null | undefined;
    currentChannel: GetChannels.Channels;
    availableChannels: GetChannels.Channels[];
    resolveWith: (result?: GetChannels.Channels) => void;
    selectedChannelIdControl = new FormControl();

    // assigned by ModalService.fromComponent() call

    constructor(private dataService: DataService, private notificationService: NotificationService) {}

    ngOnInit() {
        const activeChannelId$ = this.dataService.client
            .userStatus()
            .mapSingle(({ userStatus }) => userStatus.activeChannelId);
        const allChannels$ = this.dataService.settings.getChannels().mapSingle(data => data.channels);

        combineLatest(activeChannelId$, allChannels$).subscribe(([activeChannelId, channels]) => {
            // tslint:disable-next-line:no-non-null-assertion
            this.currentChannel = channels.find(c => c.id === activeChannelId)!;
            this.availableChannels = channels;
        });

        this.selectedChannelIdControl.valueChanges.subscribe(ids => {
            this.selectChannel(ids);
        });
    }

    selectChannel(channelIds: string[]) {
        this.selectedChannel = this.availableChannels.find(c => c.id === channelIds[0]);
    }

    assign() {
        const selectedChannel = this.selectedChannel;
        if (selectedChannel) {
            this.resolveWith(selectedChannel);
        }
    }

    cancel() {
        this.resolveWith();
    }
}
