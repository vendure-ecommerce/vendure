import { AdjustmentOperationTarget, AdjustmentType } from 'shared/generated-types';

import { OrderItem } from '../../entity/order-item/order-item.entity';
import { Order } from '../../entity/order/order.entity';

import { AdjustmentConditionConfig } from './adjustment-types';

export const minimumOrderAmount: AdjustmentConditionConfig<Order> = {
    type: AdjustmentType.PROMOTION,
    target: AdjustmentOperationTarget.ORDER,
    code: 'minimum_order_amount',
    args: [{ name: 'amount', type: 'money' }],
    predicate(target: Order, args) {
        return target.price >= args.amount;
    },
    description: 'If order total is greater than { amount }',
};

export const dateRange: AdjustmentConditionConfig<Order> = {
    type: AdjustmentType.PROMOTION,
    target: AdjustmentOperationTarget.ORDER,
    code: 'date_range',
    args: [{ name: 'start', type: 'datetime' }, { name: 'end', type: 'datetime' }],
    predicate(target: Order, args) {
        const now = Date.now();
        return args.start < now && now < args.end;
    },
    description: 'If Order placed between { start } and { end }',
};

export const atLeastNOfProduct: AdjustmentConditionConfig<OrderItem> = {
    type: AdjustmentType.PROMOTION,
    target: AdjustmentOperationTarget.ORDER_ITEM,
    code: 'at_least_n_of_product',
    args: [{ name: 'minimum', type: 'int' }],
    predicate(target: OrderItem, args) {
        return target.quantity >= args.minimum;
    },
    description: 'Buy at least { minimum } of any product',
};

export const defaultAdjustmentConditions = [minimumOrderAmount, dateRange, atLeastNOfProduct];
