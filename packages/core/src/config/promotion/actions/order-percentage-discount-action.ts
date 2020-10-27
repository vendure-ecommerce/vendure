import { LanguageCode } from '@vendure/common/lib/generated-types';

import { PromotionOrderAction } from '../promotion-action';

export const orderPercentageDiscount = new PromotionOrderAction({
    code: 'order_percentage_discount',
    args: {
        discount: {
            type: 'int',
            ui: {
                component: 'number-form-input',
                suffix: '%',
            },
        },
    },
    execute(ctx, order, args) {
        return -order.subTotal * (args.discount / 100);
    },
    description: [{ languageCode: LanguageCode.en, value: 'Discount order by { discount }%' }],
});
