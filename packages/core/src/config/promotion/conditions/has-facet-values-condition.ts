import { LanguageCode } from '@vendure/common/lib/generated-types';

import { TransactionalConnection } from '../../../connection/transactional-connection';
import { PromotionCondition } from '../promotion-condition';
import { FacetValueChecker } from '../utils/facet-value-checker';

let facetValueChecker: FacetValueChecker;

export const hasFacetValues = new PromotionCondition({
    code: 'at_least_n_with_facets',
    description: [
        { languageCode: LanguageCode.en, value: 'Buy at least { minimum } products with the given facets' },
    ],
    args: {
        minimum: { type: 'int', defaultValue: 1 },
        facets: { type: 'ID', list: true, ui: { component: 'facet-value-form-input' } },
    },
    init(injector) {
        facetValueChecker = new FacetValueChecker(injector.get(TransactionalConnection));
    },
    // eslint-disable-next-line no-shadow,@typescript-eslint/no-shadow
    async check(ctx, order, args) {
        let matches = 0;
        for (const line of order.lines) {
            if (await facetValueChecker.hasFacetValues(line, args.facets, ctx)) {
                matches += line.quantity;
            }
        }
        return args.minimum <= matches;
    },
});
