import { LanguageCode } from '@vendure/common/lib/generated-types';

import { TransactionalConnection } from '../../../service/transaction/transactional-connection';
import { PromotionItemAction } from '../promotion-action';
import { FacetValueChecker } from '../utils/facet-value-checker';

let facetValueChecker: FacetValueChecker;

export const discountOnItemWithFacets = new PromotionItemAction({
    code: 'facet_based_discount',
    args: {
        discount: {
            type: 'int',
            ui: {
                component: 'number-form-input',
                suffix: '%',
            },
        },
        facets: {
            type: 'ID',
            list: true,
            ui: { component: 'facet-value-form-input' },
        },
    },
    init(injector) {
        facetValueChecker = new FacetValueChecker(injector.get(TransactionalConnection));
    },
    async execute(orderItem, orderLine, args) {
        if (await facetValueChecker.hasFacetValues(orderLine, args.facets)) {
            return -orderItem.unitPriceWithPromotions * (args.discount / 100);
        }
        return 0;
    },
    description: [
        { languageCode: LanguageCode.en, value: 'Discount products with these facets by { discount }%' },
    ],
});
