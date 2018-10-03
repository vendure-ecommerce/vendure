import { AdjustmentOperation, AdjustmentType } from 'shared/generated-types';

import { OrderItem } from '../../entity/order-item/order-item.entity';
import { Order } from '../../entity/order/order.entity';

export type AdjustmentActionArgType = 'percentage' | 'money';
export type AdjustmentActionArg = { name: string; type: AdjustmentActionArgType; value?: string };
export type AdjustmentActionCalculation<T extends OrderItem | Order> = (
    target: T,
    args: { [argName: string]: any },
    context: any,
) => number;

export interface AdjustmentActionConfig<T extends OrderItem | Order> extends AdjustmentOperation {
    args: AdjustmentActionArg[];
    calculate: AdjustmentActionCalculation<T>;
}

export const orderPercentageDiscount: AdjustmentActionConfig<Order> = {
    type: AdjustmentType.PROMOTION,
    code: 'order_percentage_discount',
    args: [{ name: 'discount', type: 'percentage' }],
    calculate(target, args) {
        return target.price * args.discount;
    },
    description: 'Discount order by { discount }%',
};
