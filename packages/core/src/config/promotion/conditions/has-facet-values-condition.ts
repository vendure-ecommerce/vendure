import { LanguageCode } from '@vendure/common/lib/generated-types';

import { Order } from '../../../entity/order/order.entity';
import { PromotionCondition } from '../promotion-condition';

export const hasFacetValues = new PromotionCondition({
    code: 'at_least_n_with_facets',
    description: [
        { languageCode: LanguageCode.en, value: 'Buy at least { minimum } products with the given facets' },
    ],
    args: {
        minimum: { type: 'int' },
        facets: { type: 'ID', list: true },
    },

    // tslint:disable-next-line:no-shadowed-variable
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
