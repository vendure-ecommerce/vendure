import { LanguageCode } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../../api/common/request-context';
import { Channel } from '../../../entity/channel/channel.entity';
import { TaxCategory } from '../../../entity/tax-category/tax-category.entity';
import { TaxRate } from '../../../entity/tax-rate/tax-rate.entity';
import { Zone } from '../../../entity/zone/zone.entity';

export const taxCategoryStandard = new TaxCategory({
    id: 'taxCategoryStandard',
    name: 'Standard Tax',
});
export const taxCategoryReduced = new TaxCategory({
    id: 'taxCategoryReduced',
    name: 'Reduced Tax',
});
export const zoneDefault = new Zone({
    id: 'zoneDefault',
    name: 'Default Zone',
});
export const zoneOther = new Zone({
    id: 'zoneOther',
    name: 'Other Zone',
});
export const zoneWithNoTaxRate = new Zone({
    id: 'zoneWithNoTaxRate',
    name: 'Zone for which no TaxRate is configured',
});
export const taxRateDefaultStandard = new TaxRate({
    id: 'taxRateDefaultStandard',
    name: 'Default Standard',
    value: 20,
    enabled: true,
    zone: zoneDefault,
    category: taxCategoryStandard,
});
export const taxRateDefaultReduced = new TaxRate({
    id: 'taxRateDefaultReduced',
    name: 'Default Reduced',
    value: 10,
    enabled: true,
    zone: zoneDefault,
    category: taxCategoryReduced,
});
export const taxRateOtherStandard = new TaxRate({
    id: 'taxRateOtherStandard',
    name: 'Other Standard',
    value: 15,
    enabled: true,
    zone: zoneOther,
    category: taxCategoryStandard,
});
export const taxRateOtherReduced = new TaxRate({
    id: 'taxRateOtherReduced',
    name: 'Other Reduced',
    value: 5,
    enabled: true,
    zone: zoneOther,
    category: taxCategoryReduced,
});

export class MockConnection {
    getRepository() {
        return {
            find() {
                return Promise.resolve([
                    taxRateDefaultStandard,
                    taxRateDefaultReduced,
                    taxRateOtherStandard,
                    taxRateOtherReduced,
                ]);
            },
        };
    }
}

export function createRequestContext(options: { pricesIncludeTax: boolean }): RequestContext {
    const channel = new Channel({
        defaultTaxZone: zoneDefault,
        pricesIncludeTax: options.pricesIncludeTax,
    });
    const ctx = new RequestContext({
        apiType: 'admin',
        channel,
        authorizedAsOwnerOnly: false,
        languageCode: LanguageCode.en,
        isAuthorized: true,
        session: {} as any,
    });
    return ctx;
}
