import { LanguageCode } from '@vendure/common/lib/generated-types';
import { ShippingEligibilityChecker } from '@vendure/core';

export const countryCodeShippingEligibilityChecker = new ShippingEligibilityChecker({
    code: 'country-code-shipping-eligibility-checker',
    description: [{ languageCode: LanguageCode.en, value: 'Country Shipping Eligibility Checker' }],
    args: {
        countryCode: {
            type: 'string',
        },
    },
    check: (ctx, order, args) => {
        return order.shippingAddress?.countryCode === args.countryCode;
    },
});
