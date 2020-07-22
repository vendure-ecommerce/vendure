import { LanguageCode } from '@vendure/common/lib/generated-types';

import { Order } from '../../entity/order/order.entity';

import { PromotionCondition } from './promotion-condition';

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

export const atLeastNWithFacets = new PromotionCondition({
    code: 'at_least_n_with_facets',
    description: [
        { languageCode: LanguageCode.en, value: 'Buy at least { minimum } products with the given facets' },
    ],
    args: {
        minimum: { type: 'int' },
        facets: { type: 'facetValueIds' },
    },
    async check(order: Order, args, { hasFacetValues }) {
        let matches = 0;
        for (const line of order.lines) {
            if (await hasFacetValues(line, args.facets)) {
                matches += line.quantity;
            }
        }
        return args.minimum <= matches;
    },
});

export const defaultPromotionConditions = [minimumOrderAmount, atLeastNWithFacets];
