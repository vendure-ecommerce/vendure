import { LanguageCode } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { PromotionCondition } from '../promotion-condition';

export const buyXGetYFreeCondition = new PromotionCondition({
    code: 'buy_x_get_y_free',
    description: [
        {
            languageCode: LanguageCode.en,
            value:
                'Buy { amountX } of { variantIdsX } products, get { amountY } of { variantIdsY } products free',
        },
    ],
    args: {
        amountX: {
            type: 'int',
            defaultValue: 2,
        },
        variantIdsX: {
            type: 'ID',
            list: true,
            ui: { component: 'product-selector-form-input' },
            label: [{ languageCode: LanguageCode.en, value: 'Product variants X' }],
        },
        amountY: {
            type: 'int',
            defaultValue: 1,
        },
        variantIdsY: {
            type: 'ID',
            list: true,
            ui: { component: 'product-selector-form-input' },
            label: [{ languageCode: LanguageCode.en, value: 'Product variants Y' }],
        },
    },
    async check(ctx, order, args) {
        const xIds = createIdentityMap(args.variantIdsX);
        const yIds = createIdentityMap(args.variantIdsY);
        let matches = 0;
        const freeItemCandidates = [];
        for (const line of order.lines) {
            const variantId = line.productVariant.id;
            if (variantId in xIds) {
                matches += line.quantity;
            }
            if (variantId in yIds) {
                freeItemCandidates.push(...line.items);
            }
        }
        const quantity = Math.floor(matches / args.amountX);
        if (!quantity || !freeItemCandidates.length) return false;
        const freeItemIds = freeItemCandidates
            .sort((a, b) => {
                const unitPriceA = ctx.channel.pricesIncludeTax ? a.unitPriceWithTax : a.unitPrice;
                const unitPriceB = ctx.channel.pricesIncludeTax ? b.unitPriceWithTax : b.unitPrice;
                if (unitPriceA < unitPriceB) return -1;
                if (unitPriceA > unitPriceB) return 1;
                return 0;
            })
            .map(({ id }) => id)
            .slice(0, quantity * args.amountY);
        return { freeItemIds };
    },
});

function createIdentityMap(ids: ID[]): Record<ID, ID> {
    return ids.reduce((map: Record<ID, ID>, id) => ({ ...map, [id]: id }), {});
}
