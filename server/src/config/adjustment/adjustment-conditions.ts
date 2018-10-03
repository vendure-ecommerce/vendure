import { AdjustmentOperation, AdjustmentType } from 'shared/generated-types';

import { OrderItem } from '../../entity/order-item/order-item.entity';
import { Order } from '../../entity/order/order.entity';

export type AdjustmentConditionArgType = 'int' | 'money' | 'string' | 'datetime';
export type AdjustmentConditionArg = { name: string; type: AdjustmentConditionArgType };
export type AdjustmentConditionPredicate<T extends OrderItem | Order> = (
    target: T,
    args: { [argName: string]: any },
    context: any,
) => boolean;

export interface AdjustmentConditionConfig<T extends OrderItem | Order> extends AdjustmentOperation {
    args: AdjustmentConditionArg[];
    predicate: AdjustmentConditionPredicate<T>;
}

export const minimumOrderAmount: AdjustmentConditionConfig<Order> = {
    type: AdjustmentType.PROMOTION,
    code: 'minimum_order_amount',
    args: [{ name: 'amount', type: 'money' }],
    predicate(target: Order, args) {
        return target.price >= args.amount;
    },
    description: 'If order total is greater than { amount }',
};

export const dateRange: AdjustmentConditionConfig<Order> = {
    type: AdjustmentType.PROMOTION,
    code: 'date_range',
    args: [{ name: 'start', type: 'datetime' }, { name: 'end', type: 'datetime' }],
    predicate(target: Order, args) {
        const now = Date.now();
        return args.start < now && now < args.end;
    },
    description: 'If Order placed between { start } and { end }',
};
