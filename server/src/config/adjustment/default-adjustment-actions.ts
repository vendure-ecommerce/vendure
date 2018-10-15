import { AdjustmentActionDefinition } from './adjustment-types';

export const orderPercentageDiscount: AdjustmentActionDefinition = {
    code: 'order_percentage_discount',
    args: [{ name: 'discount', type: 'percentage' }],
    calculate(order, args) {
        return [{ amount: -(order.totalPrice * args.discount) / 100 }];
    },
    description: 'Discount order by { discount }%',
};

export const itemPercentageDiscount: AdjustmentActionDefinition = {
    code: 'item_percentage_discount',
    args: [{ name: 'discount', type: 'percentage' }],
    calculate(order, args) {
        return order.lines.map(item => ({
            orderItemId: item.id,
            amount: -(item.totalPrice * args.discount) / 100,
        }));
    },
    description: 'Discount every item by { discount }%',
};

export const defaultAdjustmentActions = [orderPercentageDiscount, itemPercentageDiscount];
