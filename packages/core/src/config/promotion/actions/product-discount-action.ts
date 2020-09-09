import { LanguageCode } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { idsAreEqual } from '../../../common/utils';
import { OrderLine } from '../../../entity/order-line/order-line.entity';
import { PromotionItemAction } from '../promotion-action';

export const productsPercentageDiscount = new PromotionItemAction({
    code: 'products_percentage_discount',
    description: [{ languageCode: LanguageCode.en, value: 'Discount specified products by { discount }%' }],
    args: {
        discount: {
            type: 'int',
            ui: {
                component: 'number-form-input',
                suffix: '%',
            },
        },
        productVariantIds: {
            type: 'ID',
            list: true,
            ui: { component: 'product-selector-form-input' },
            label: [{ languageCode: LanguageCode.en, value: 'Product variants' }],
        },
    },

    execute(orderItem, orderLine, args) {
        if (lineContainsIds(args.productVariantIds, orderLine)) {
            return -orderItem.unitPriceWithPromotions * (args.discount / 100);
        }
        return 0;
    },
});

function lineContainsIds(ids: ID[], line: OrderLine): boolean {
    return !!ids.find((id) => idsAreEqual(id, line.productVariant.id));
}
