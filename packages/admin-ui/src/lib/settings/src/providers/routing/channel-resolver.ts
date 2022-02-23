import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
    BaseEntityResolver,
    ChannelFragment,
    CurrencyCode,
    DataService,
    getDefaultUiLanguage,
} from '@vendure/admin-ui/core';

/**
 * Resolves the id from the path into a Customer entity.
 */
@Injectable({
    providedIn: 'root',
})
export class ChannelResolver extends BaseEntityResolver<ChannelFragment> {
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
                defaultLanguageCode: getDefaultUiLanguage(),
                defaultShippingZone: {} as any,
                defaultTaxZone: {} as any,
            },
            id => dataService.settings.getChannel(id).mapStream(data => data.channel),
        );
    }
}
