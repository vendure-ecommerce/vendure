import { Order } from '../../entity/order/order.entity';

import { PromotionCondition } from './promotion-condition';

export const minimumOrderAmount = new PromotionCondition({
    description: 'If order total is greater than { amount }',
    code: 'minimum_order_amount',
    args: {
        amount: 'money',
        taxInclusive: 'boolean',
    },
    check(order, args) {
        if (args.taxInclusive) {
            return order.subTotal >= args.amount;
        } else {
            return order.subTotalBeforeTax >= args.amount;
        }
    },
    priorityValue: 10,
});

export const dateRange = new PromotionCondition({
    code: 'date_range',
    description: 'If Order placed between { start } and { end }',
    args: { start: 'datetime', end: 'datetime' },
    check(order: Order, args) {
        const now = new Date();
        return args.start < now && now < args.end;
    },
});

export const atLeastNOfProduct = new PromotionCondition({
    code: 'at_least_n_of_product',
    description: 'Buy at least { minimum } of any product',
    args: { minimum: 'int' },
    check(order: Order, args) {
        return order.lines.reduce((result, item) => {
            return result || item.quantity >= args.minimum;
        }, false);
    },
});

export const defaultPromotionConditions = [minimumOrderAmount, dateRange, atLeastNOfProduct];
