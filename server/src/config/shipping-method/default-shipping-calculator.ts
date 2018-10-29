import { ShippingCalculator } from './shipping-calculator';

export const defaultShippingCalculator = new ShippingCalculator({
    code: 'default-shipping-calculator',
    description: 'Default Flat-Rate Shipping Calculator',
    args: {
        rate: 'money',
    },
    calculate: (order, args) => {
        return args.rate;
    },
});
