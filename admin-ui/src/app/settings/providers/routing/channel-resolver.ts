import { Injectable } from '@angular/core';
import { Channel } from 'shared/generated-types';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { getDefaultLanguage } from '../../../common/utilities/get-default-language';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable()
export class ChannelResolver extends BaseEntityResolver<Channel.Fragment> {
    constructor(private dataService: DataService) {
        super(
            {
                __typename: 'Channel',
                id: '',
                code: '',
                token: '',
                defaultLanguageCode: getDefaultLanguage(),
                defaultShippingZone: {} as any,
                defaultTaxZone: {} as any,
            },
            id => this.dataService.settings.getChannel(id).mapStream(data => data.channel),
        );
    }
}
