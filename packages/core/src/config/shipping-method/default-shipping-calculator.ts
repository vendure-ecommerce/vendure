import { ConfigArgType } from '@vendure/common/lib/generated-types';

import { ShippingCalculator } from './shipping-calculator';

export const defaultShippingCalculator = new ShippingCalculator({
    code: 'default-shipping-calculator',
    description: 'Default Flat-Rate Shipping Calculator',
    args: {
        rate: ConfigArgType.MONEY,
    },
    calculate: (order, args) => {
        return args.rate;
    },
});
