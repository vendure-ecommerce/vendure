import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { BaseEntityResolver } from '../../../common/base-entity-resolver';
import { Channel, CurrencyCode } from '../../../common/generated-types';
import { getDefaultLanguage } from '../../../common/utilities/get-default-language';
import { DataService } from '../../../data/providers/data.service';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable()
export class ChannelResolver extends BaseEntityResolver<Channel.Fragment> {
    constructor(router: Router, dataService: DataService) {
        super(
            router,
            {
                __typename: 'Channel',
                id: '',
                createdAt: '',
                updatedAt: '',
                code: '',
                token: '',
                pricesIncludeTax: false,
                currencyCode: CurrencyCode.USD,
                defaultLanguageCode: getDefaultLanguage(),
                defaultShippingZone: {} as any,
                defaultTaxZone: {} as any,
            },
            id => dataService.settings.getChannel(id).mapStream(data => data.channel),
        );
    }
}
