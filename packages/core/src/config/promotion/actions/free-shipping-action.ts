import { LanguageCode } from '@vendure/common/lib/generated-types';

import { PromotionShippingAction } from '../promotion-action';

export const freeShipping = new PromotionShippingAction({
    code: 'free_shipping',
    args: {},
    execute(ctx, shippingLine, order, args) {
        return ctx.channel.pricesIncludeTax ? -shippingLine.priceWithTax : -shippingLine.price;
    },
    description: [{ languageCode: LanguageCode.en, value: 'Free shipping' }],
});
