import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CurrentUserChannel } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';
import { LocalStorageService } from '../../providers/local-storage/local-storage.service';
import set = Reflect.set;

@Component({
    selector: 'vdr-channel-switcher',
    templateUrl: './channel-switcher.component.html',
    styleUrls: ['./channel-switcher.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelSwitcherComponent implements OnInit {
    channels$: Observable<CurrentUserChannel[]>;
    activeChannel$: Observable<CurrentUserChannel | null>;
    constructor(private dataService: DataService, private localStorageService: LocalStorageService) {}

    ngOnInit() {
        this.channels$ = this.dataService.client.userStatus().mapStream(data => data.userStatus.channels);
        this.activeChannel$ = this.dataService.client
            .userStatus()
            .mapStream(
                data => data.userStatus.channels.find(c => c.id === data.userStatus.activeChannelId) || null,
            );
    }

    setActiveChannel(channelId: string) {
        this.dataService.client.setActiveChannel(channelId).subscribe(({ setActiveChannel }) => {
            const activeChannel = setActiveChannel.channels.find(c => c.id === channelId);
            if (activeChannel) {
                this.localStorageService.set('activeChannelToken', activeChannel.token);
            }
        });
    }
}
