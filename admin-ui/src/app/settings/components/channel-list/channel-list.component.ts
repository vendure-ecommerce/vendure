import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Channel } from 'shared/generated-types';

import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-channel-list',
    templateUrl: './channel-list.component.html',
    styleUrls: ['./channel-list.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelListComponent {
    channels$: Observable<Channel.Fragment[]>;

    constructor(private dataService: DataService) {
        this.channels$ = this.dataService.settings.getChannels().mapStream(data => data.channels);
    }
}
