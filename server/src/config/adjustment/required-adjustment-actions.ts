import { AdjustmentType } from 'shared/generated-types';

import { idsAreEqual } from '../../common/utils';

import { AdjustmentActionDefinition, TaxActionDefinition } from './adjustment-types';

export const taxAction: TaxActionDefinition = {
    type: AdjustmentType.TAX,
    code: 'tax_action',
    args: [{ name: 'taxRate', type: 'percentage' }],
    calculate(order, args, context) {
        return order.items
            .filter(item => idsAreEqual(item.taxCategoryId, context.taxCategoryId))
            .map(item => ({
                orderItemId: item.id,
                amount: (item.totalPrice * args.taxRate) / 100,
            }));
    },
    description: 'Apply tax of { discount }%',
};
