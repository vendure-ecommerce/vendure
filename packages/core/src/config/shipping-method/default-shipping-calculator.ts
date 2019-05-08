import { ConfigArgType } from '@vendure/common/lib/generated-types';

import { ShippingCalculator } from './shipping-calculator';

export const defaultShippingCalculator = new ShippingCalculator({
    code: 'default-shipping-calculator',
    description: 'Default Flat-Rate Shipping Calculator',
    args: {
        rate: ConfigArgType.MONEY,
        taxRate: ConfigArgType.PERCENTAGE,
    },
    calculate: (order, args) => {
        return { price: args.rate, priceWithTax: args.rate * ((100 + args.taxRate) / 100) };
    },
});
