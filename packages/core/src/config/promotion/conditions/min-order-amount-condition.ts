import { LanguageCode } from '@vendure/common/lib/generated-types';

import { PromotionCondition } from '../promotion-condition';

export const minimumOrderAmount = new PromotionCondition({
    description: [{ languageCode: LanguageCode.en, value: 'If order total is greater than { amount }' }],
    code: 'minimum_order_amount',
    args: {
        amount: { type: 'int', config: { inputType: 'money' } },
        taxInclusive: { type: 'boolean' },
        ids: { type: 'string', list: true },
    },
    check(order, args) {
        if (args.taxInclusive) {
            return order.subTotal >= args.amount;
        } else {
            return order.subTotalBeforeTax >= args.amount;
        }
    },
    priorityValue: 10,
});
