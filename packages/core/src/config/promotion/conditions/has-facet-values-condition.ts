import { LanguageCode } from '@vendure/common/lib/generated-types';

import { Order } from '../../../entity/order/order.entity';
import { PromotionCondition } from '../promotion-condition';
import { FacetValueChecker } from '../utils/facet-value-checker';

let facetValueChecker: FacetValueChecker;

export const hasFacetValues = new PromotionCondition({
    code: 'at_least_n_with_facets',
    description: [
        { languageCode: LanguageCode.en, value: 'Buy at least { minimum } products with the given facets' },
    ],
    args: {
        minimum: { type: 'int' },
        facets: { type: 'ID', list: true },
    },
    init(injector) {
        facetValueChecker = new FacetValueChecker(injector.getConnection());
    },
    // tslint:disable-next-line:no-shadowed-variable
    async check(order: Order, args) {
        let matches = 0;
        for (const line of order.lines) {
            if (await facetValueChecker.hasFacetValues(line, args.facets)) {
                matches += line.quantity;
            }
        }
        return args.minimum <= matches;
    },
});
