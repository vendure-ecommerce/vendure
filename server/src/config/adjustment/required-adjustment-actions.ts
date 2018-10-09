import { AdjustmentType } from 'shared/generated-types';

import { AdjustmentActionDefinition } from './adjustment-types';

export const taxAction: AdjustmentActionDefinition = {
    type: AdjustmentType.TAX,
    code: 'tax_action',
    args: [{ name: 'discount', type: 'percentage' }],
    calculate(order, args) {
        return order.items.map(item => ({
            orderItemId: item.id,
            amount: -(item.totalPrice * args.discount) / 100,
        }));
    },
    description: 'Apply tax of { discount }%',
};
