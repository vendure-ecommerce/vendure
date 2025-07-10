import { Fulfillment, Order, Payment } from './order-types.js';

/**
 * Calculates the outstanding payment amount for an order
 */
export function calculateOutstandingPaymentAmount(order: Order): number {
    if (!order) return 0;

    const paymentIsValid = (p: Payment): boolean =>
        p.state !== 'Cancelled' && p.state !== 'Declined' && p.state !== 'Error';

    let amountCovered = 0;
    for (const payment of order.payments?.filter(paymentIsValid) ?? []) {
        const refunds = payment.refunds.filter(r => r.state !== 'Failed') ?? [];
        const refundsTotal = refunds.reduce((sum, refund) => sum + (refund.total || 0), 0);
        amountCovered += payment.amount - refundsTotal;
    }
    return order.totalWithTax - amountCovered;
}

/**
 * Checks if an order has unsettled modifications
 */
export function hasUnsettledModifications(order: Order): boolean {
    if (!order) return false;
    return order.modifications.some(m => !m.isSettled);
}

/**
 * Determines if the add manual payment button should be displayed
 */
export function shouldShowAddManualPaymentButton(order: Order): boolean {
    if (!order) return false;

    return (
        order.type !== 'Aggregate' &&
        (order.state === 'ArrangingPayment' || order.state === 'ArrangingAdditionalPayment') &&
        (hasUnsettledModifications(order) || calculateOutstandingPaymentAmount(order) > 0)
    );
}

/**
 * Determines if we can add a fulfillment to an order
 */
export function canAddFulfillment(order: Order): boolean {
    if (!order) return false;

    // Get all fulfillment lines from non-cancelled fulfillments
    const allFulfillmentLines: Fulfillment['lines'] = (order.fulfillments ?? [])
        .filter(fulfillment => fulfillment.state !== 'Cancelled')
        .reduce((all, fulfillment) => [...all, ...fulfillment.lines], [] as Fulfillment['lines']);

    // Check if all items are already fulfilled
    let allItemsFulfilled = true;
    for (const line of order.lines) {
        const totalFulfilledCount = allFulfillmentLines
            .filter(row => row.orderLineId === line.id)
            .reduce((sum, row) => sum + row.quantity, 0);
        if (totalFulfilledCount < line.quantity) {
            allItemsFulfilled = false;
            break;
        }
    }

    // Check if order is in a fulfillable state
    const isFulfillableState =
        (order.nextStates.includes('Shipped') ||
            order.nextStates.includes('PartiallyShipped') ||
            order.nextStates.includes('Delivered')) &&
        order.state !== 'ArrangingAdditionalPayment';

    return (
        !allItemsFulfilled &&
        !hasUnsettledModifications(order) &&
        calculateOutstandingPaymentAmount(order) === 0 &&
        isFulfillableState
    );
}
