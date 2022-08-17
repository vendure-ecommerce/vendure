import { LanguageCode } from '@vendure/common/lib/generated-types';

import { PromotionOrderAction } from '../promotion-action';

export const orderFixedDiscount = new PromotionOrderAction({
    code: 'order_fixed_discount',
    args: {
        discount: {
            type: 'int',
            ui: {
                component: 'currency-form-input',
            },
        },
    },
    execute(ctx, order, args) {
        return -Math.min(args.discount, order.total);
    },
    description: [{ languageCode: LanguageCode.en, value: 'Discount order by fixed amount' }],
});
