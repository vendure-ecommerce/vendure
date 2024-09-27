import { Order, OrderLine } from '@vendure/core';

import { PayPalOrderItem, PayPalOrderPurchaseUnitAmount } from './types';

export function convertAmount(amount: number, precision: number): string {
    if (typeof amount !== 'number') {
        throw new Error('Invalid amount: must be a number');
    }
    if (typeof precision !== 'number') {
        throw new Error('Invalid precision: must be a number');
    }
    if (precision > 3) {
        throw new Error('Precision must be 3 or less to guarantee correct rounding');
    }

    const decimalDivisor = Math.pow(10, precision);
    return (amount / decimalDivisor).toFixed(precision).toString();
}

export function calculateOrderLineTotal(lines: OrderLine[]): number {
    return lines.reduce((total, line) => total + line.unitPriceWithTax * line.quantity, 0);
}

export function createAmount(order: Order, precision: number): PayPalOrderPurchaseUnitAmount {
    const itemTotalWithTax = calculateOrderLineTotal(order.lines);

    return {
        currency_code: order.currencyCode,
        value: convertAmount(order.totalWithTax, precision),
        breakdown: {
            item_total: {
                currency_code: order.currencyCode,
                value: convertAmount(itemTotalWithTax, precision),
            },
            shipping: {
                currency_code: order.currencyCode,
                value: convertAmount(order.shippingWithTax, precision),
            },
        },
    };
}

export function createItem(order: Order, orderLine: OrderLine, precision: number): PayPalOrderItem {
    return {
        name: orderLine.productVariant.name,
        quantity: orderLine.quantity.toString(),
        unit_amount: {
            currency_code: order.currencyCode,
            value: convertAmount(orderLine.unitPriceWithTax, precision),
        },
    };
}
