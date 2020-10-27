import { LanguageCode } from '@vendure/common/lib/generated-types';

import { ShippingCalculator } from './shipping-calculator';

export const defaultShippingCalculator = new ShippingCalculator({
    code: 'default-shipping-calculator',
    description: [{ languageCode: LanguageCode.en, value: 'Default Flat-Rate Shipping Calculator' }],
    args: {
        rate: {
            type: 'int',
            ui: { component: 'currency-form-input' },
            label: [{ languageCode: LanguageCode.en, value: 'Shipping price' }],
        },
        taxRate: {
            type: 'int',
            ui: { component: 'number-form-input', suffix: '%' },
            label: [{ languageCode: LanguageCode.en, value: 'Tax rate' }],
        },
    },
    calculate: (ctx, order, args) => {
        return { price: args.rate, priceWithTax: args.rate * ((100 + args.taxRate) / 100) };
    },
});
