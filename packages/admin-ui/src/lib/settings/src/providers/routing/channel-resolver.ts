import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BaseEntityResolver } from '@vendure/admin-ui/core';
import { Channel, CurrencyCode } from '@vendure/admin-ui/core';
import { getDefaultLanguage } from '@vendure/admin-ui/core';
import { DataService } from '@vendure/admin-ui/core';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable({
    providedIn: 'root',
})
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
