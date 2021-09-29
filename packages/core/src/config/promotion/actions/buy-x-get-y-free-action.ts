import { LanguageCode } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { idsAreEqual } from '../../../common/utils';
import { OrderItem } from '../../../entity';
import { buyXGetYFreeCondition } from '../conditions/buy-x-get-y-free-condition';
import { PromotionItemAction } from '../promotion-action';

export const buyXGetYFreeAction = new PromotionItemAction({
    code: 'buy_x_get_y_free',
    description: [
        {
            languageCode: LanguageCode.en,
            value:
                'Buy { amountX } of { variantIdsX } products, get { amountY } of { variantIdsY } products free',
        },
    ],
    args: {},
    conditions: [buyXGetYFreeCondition],
    execute(ctx, orderItem, orderLine, args, state) {
        const freeItemIds = state.buy_x_get_y_free.freeItemIds;
        if (idsContainsItem(freeItemIds, orderItem)) {
            const unitPrice = ctx.channel.pricesIncludeTax ? orderLine.unitPriceWithTax : orderLine.unitPrice;
            return -unitPrice;
        }
        return 0;
    },
});

function idsContainsItem(ids: ID[], item: OrderItem): boolean {
    return !!ids.find(id => idsAreEqual(id, item.id));
}
