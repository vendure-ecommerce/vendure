import { LanguageCode } from '@vendure/common/lib/generated-types';

import { PromotionItemAction } from '../promotion-action';

export const orderLineFixedDiscount = new PromotionItemAction({
    code: 'order_line_fixed_discount',
    args: {
        discount: {
            type: 'int',
            ui: {
                component: 'currency-form-input',
            },
        },
        discountMode: {
            type: 'string',
            ui: {
                component: 'select-form-input',
                options: [
                    { label: 'Unit', value: 'unit' },
                    { label: 'Line', value: 'line' },
                ],
            },
        },
    },
    execute(ctx, orderLine, args) {
        return {
            amount: -args.discount,
            discountMode: (args.discountMode as 'unit' | 'line') || 'line',
        };
    },
    description: [{ languageCode: LanguageCode.en, value: 'Discount orderLine by fixed amount' }],
});
