import { LanguageCode } from '@vendure/common/lib/generated-types';

import { ShippingCalculator } from './shipping-calculator';

export const defaultShippingCalculator = new ShippingCalculator({
    code: 'default-shipping-calculator',
    description: [{ languageCode: LanguageCode.en, value: 'Default Flat-Rate Shipping Calculator' }],
    args: {
        rate: { type: 'int', config: { inputType: 'money' } },
        taxRate: { type: 'int', config: { inputType: 'percentage' } },
    },
    calculate: (order, args) => {
        return { price: args.rate, priceWithTax: args.rate * ((100 + args.taxRate) / 100) };
    },
});
