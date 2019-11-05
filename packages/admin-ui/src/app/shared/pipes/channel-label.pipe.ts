import { Pipe, PipeTransform } from '@angular/core';
import { DEFAULT_CHANNEL_CODE } from 'shared/shared-constants';

import { _ } from '../../core/providers/i18n/mark-for-extraction';

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
