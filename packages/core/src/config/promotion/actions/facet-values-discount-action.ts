import { LanguageCode } from '@vendure/common/lib/generated-types';

import { PromotionItemAction } from '../promotion-action';
import { FacetValueChecker } from '../utils/facet-value-checker';

let facetValueChecker: FacetValueChecker;

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
    init(injector) {
        facetValueChecker = new FacetValueChecker(injector.getConnection());
    },
    async execute(orderItem, orderLine, args) {
        if (await facetValueChecker.hasFacetValues(orderLine, args.facets)) {
            return -orderLine.unitPrice * (args.discount / 100);
        }
        return 0;
    },
    description: [
        { languageCode: LanguageCode.en, value: 'Discount products with these facets by { discount }%' },
    ],
});
