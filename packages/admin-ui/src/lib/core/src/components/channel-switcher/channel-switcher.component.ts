import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { combineLatest, Observable } from 'rxjs';
import { filter, map, startWith } from 'rxjs/operators';

import { CurrentUserChannel } from '../../common/generated-types';
import { DataService } from '../../data/providers/data.service';
import { LocalStorageService } from '../../providers/local-storage/local-storage.service';

@Component({
    selector: 'vdr-channel-switcher',
    templateUrl: './channel-switcher.component.html',
    styleUrls: ['./channel-switcher.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelSwitcherComponent implements OnInit {
    readonly displayFilterThreshold = 10;
    channels$: Observable<CurrentUserChannel[]>;
    channelCount$: Observable<number>;
    filterControl = new FormControl('');
    activeChannelCode$: Observable<string>;
    constructor(private dataService: DataService, private localStorageService: LocalStorageService) {}

    ngOnInit() {
        const channels$ = this.dataService.client.userStatus().mapStream(data => data.userStatus.channels);
        const filterTerm$ = this.filterControl.valueChanges.pipe<string>(startWith(''));
        this.channels$ = combineLatest(channels$, filterTerm$).pipe(
            map(([channels, filterTerm]) => {
                return filterTerm
                    ? channels.filter(c =>
                          c.code.toLocaleLowerCase().includes(filterTerm.toLocaleLowerCase()),
                      )
                    : channels;
            }),
        );
        this.channelCount$ = channels$.pipe(map(channels => channels.length));
        const activeChannel$ = this.dataService.client
            .userStatus()
            .mapStream(data => data.userStatus.channels.find(c => c.id === data.userStatus.activeChannelId))
            .pipe(filter(notNullOrUndefined));
        this.activeChannelCode$ = activeChannel$.pipe(map(channel => channel.code));
    }

    setActiveChannel(channelId: string) {
        this.dataService.client.setActiveChannel(channelId).subscribe(({ setActiveChannel }) => {
            const activeChannel = setActiveChannel.channels.find(c => c.id === channelId);
            if (activeChannel) {
                this.localStorageService.set('activeChannelToken', activeChannel.token);
            }
            this.filterControl.patchValue('');
        });
    }
}
