import { Pipe, PipeTransform } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { DEFAULT_CHANNEL_CODE } from 'shared/shared-constants';

@Pipe({
    name: 'channelCodeToLabel',
})
export class ChannelLabelPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {
        if (value === DEFAULT_CHANNEL_CODE) {
            return _('common.default-channel');
        } else {
            return value;
        }
    }
}
