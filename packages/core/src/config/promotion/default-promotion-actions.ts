import { LanguageCode } from '@vendure/common/lib/generated-types';

import { PromotionItemAction, PromotionOrderAction } from './promotion-action';

export const orderPercentageDiscount = new PromotionOrderAction({
    code: 'order_percentage_discount',
    args: {
        discount: {
            type: 'int',
            config: {
                inputType: 'percentage',
            },
        },
    },
    execute(order, args) {
        return -order.subTotal * (args.discount / 100);
    },
    description: [{ languageCode: LanguageCode.en, value: 'Discount order by { discount }%' }],
});

export const discountOnItemWithFacets = new PromotionItemAction({
    code: 'facet_based_discount',
    args: {
        discount: {
            type: 'int',
            config: {
                inputType: 'percentage',
            },
        },
        facets: {
            type: 'ID',
            list: true,
        },
    },
    async execute(orderItem, orderLine, args, { hasFacetValues }) {
        if (await hasFacetValues(orderLine, args.facets)) {
            return -orderLine.unitPrice * (args.discount / 100);
        }
        return 0;
    },
    description: [
        { languageCode: LanguageCode.en, value: 'Discount products with these facets by { discount }%' },
    ],
});

export const defaultPromotionActions = [orderPercentageDiscount, discountOnItemWithFacets];
