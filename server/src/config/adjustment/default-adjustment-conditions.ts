import { Order } from '../../entity/order/order.entity';

import { AdjustmentConditionDefinition } from './adjustment-types';

export const minimumOrderAmount: AdjustmentConditionDefinition = {
    code: 'minimum_order_amount',
    args: [{ name: 'amount', type: 'money' }],
    predicate(order: Order, args) {
        return order.totalPrice >= args.amount;
    },
    description: 'If order total is greater than { amount }',
};

export const dateRange: AdjustmentConditionDefinition = {
    code: 'date_range',
    args: [{ name: 'start', type: 'datetime' }, { name: 'end', type: 'datetime' }],
    predicate(order: Order, args) {
        const now = Date.now();
        return args.start < now && now < args.end;
    },
    description: 'If Order placed between { start } and { end }',
};

export const atLeastNOfProduct: AdjustmentConditionDefinition = {
    code: 'at_least_n_of_product',
    args: [{ name: 'minimum', type: 'int' }],
    predicate(order: Order, args) {
        return order.lines.reduce((result, item) => {
            return result || item.quantity >= args.minimum;
        }, false);
    },
    description: 'Buy at least { minimum } of any product',
};

export const defaultAdjustmentConditions = [minimumOrderAmount, dateRange, atLeastNOfProduct];
