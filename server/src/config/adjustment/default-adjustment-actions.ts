import { AdjustmentType } from 'shared/generated-types';

import { AdjustmentActionDefinition } from './adjustment-types';

export const orderPercentageDiscount: AdjustmentActionDefinition = {
    type: AdjustmentType.PROMOTION,
    code: 'order_percentage_discount',
    args: [{ name: 'discount', type: 'percentage' }],
    calculate(order, args) {
        return [{ amount: (order.totalPrice * args.discount) / 100 }];
    },
    description: 'Discount order by { discount }%',
};

export const itemPercentageDiscount: AdjustmentActionDefinition = {
    type: AdjustmentType.PROMOTION,
    code: 'item_percentage_discount',
    args: [{ name: 'discount', type: 'percentage' }],
    calculate(order, args) {
        return order.items.map(item => ({
            orderItemId: item.id,
            amount: (item.totalPrice * args.discount) / 100,
        }));
    },
    description: 'Discount every item by { discount }%',
};

export const defaultAdjustmentActions = [orderPercentageDiscount, itemPercentageDiscount];
