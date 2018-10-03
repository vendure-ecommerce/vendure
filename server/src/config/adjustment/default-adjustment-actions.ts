import { AdjustmentOperationTarget, AdjustmentType } from 'shared/generated-types';

import { Order } from '../../entity/order/order.entity';

import { AdjustmentActionConfig } from './adjustment-types';

export const orderPercentageDiscount: AdjustmentActionConfig<Order> = {
    type: AdjustmentType.PROMOTION,
    target: AdjustmentOperationTarget.ORDER,
    code: 'order_percentage_discount',
    args: [{ name: 'discount', type: 'percentage' }],
    calculate(target, args) {
        return target.price * args.discount;
    },
    description: 'Discount order by { discount }%',
};

export const defaultAdjustmentActions = [orderPercentageDiscount];
