import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';

@Component({
    selector: 'vdr-channel-badge',
    templateUrl: './channel-badge.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChannelBadgeComponent {
    @Input() channelCode: string;
    @Input() size: string;

    get isDefaultChannel(): boolean {
        return this.channelCode === DEFAULT_CHANNEL_CODE;
    }
}
