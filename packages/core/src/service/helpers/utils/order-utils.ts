import { summate } from '@vendure/common/lib/shared-utils';

import { OrderItem } from '../../../entity/order-item/order-item.entity';
import { Order } from '../../../entity/order/order.entity';
import { PaymentState } from '../payment-state-machine/payment-state';

/**
 * Returns true if the Order total is covered by Payments in the specified state.
 */
export function orderTotalIsCovered(order: Order, state: PaymentState | PaymentState[]): boolean {
    const paymentsTotal = totalCoveredByPayments(order, state);
    return paymentsTotal === order.totalWithTax;
}

/**
 * Returns the total amount covered by all Payments (minus any refunds)
 */
export function totalCoveredByPayments(order: Order, state?: PaymentState | PaymentState[]): number {
    const payments = state
        ? Array.isArray(state)
            ? order.payments.filter(p => state.includes(p.state))
            : order.payments.filter(p => p.state === state)
        : order.payments.filter(p => p.state !== 'Error' && p.state !== 'Declined');
    let total = 0;
    for (const payment of payments) {
        const refundTotal = summate(payment.refunds, 'total');
        total += payment.amount - Math.abs(refundTotal);
    }
    return total;
}

/**
 * Returns true if all (non-cancelled) OrderItems are delivered.
 */
export function orderItemsAreDelivered(order: Order) {
    return getOrderItems(order)
        .filter(orderItem => !orderItem.cancelled)
        .every(isDelivered);
}

/**
 * Returns true if at least one, but not all (non-cancelled) OrderItems are delivered.
 */
export function orderItemsArePartiallyDelivered(order: Order) {
    const nonCancelledItems = getNonCancelledItems(order);
    return nonCancelledItems.some(isDelivered) && !nonCancelledItems.every(isDelivered);
}

/**
 * Returns true if at least one, but not all (non-cancelled) OrderItems are shipped.
 */
export function orderItemsArePartiallyShipped(order: Order) {
    const nonCancelledItems = getNonCancelledItems(order);
    return nonCancelledItems.some(isShipped) && !nonCancelledItems.every(isShipped);
}

/**
 * Returns true if all (non-cancelled) OrderItems are shipped.
 */
export function orderItemsAreShipped(order: Order) {
    return getOrderItems(order)
        .filter(orderItem => !orderItem.cancelled)
        .every(isShipped);
}

/**
 * Returns true if all OrderItems in the order are cancelled
 */
export function orderItemsAreAllCancelled(order: Order) {
    return getOrderItems(order).every(orderItem => orderItem.cancelled);
}

function getOrderItems(order: Order): OrderItem[] {
    return order.lines.reduce((orderItems, line) => [...orderItems, ...line.items], [] as OrderItem[]);
}
function getNonCancelledItems(order: Order): OrderItem[] {
    return getOrderItems(order).filter(orderItem => !orderItem.cancelled);
}

function isDelivered(orderItem: OrderItem) {
    return orderItem.fulfillment?.state === 'Delivered';
}
function isShipped(orderItem: OrderItem) {
    return orderItem.fulfillment?.state === 'Shipped';
}
