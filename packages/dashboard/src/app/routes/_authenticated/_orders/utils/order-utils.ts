import { ResultOf } from '@/vdb/graphql/graphql.js';

import { orderDetailDocument } from '../orders.graphql.js';

type OrderDetailFragment = ResultOf<typeof orderDetailDocument>['order'];
type Payment = NonNullable<NonNullable<OrderDetailFragment>['payments']>[number];

/**
 * Calculates the outstanding payment amount for an order
 */
export function calculateOutstandingPaymentAmount(order: OrderDetailFragment): number {
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
export function hasUnsettledModifications(order: OrderDetailFragment): boolean {
    if (!order) return false;
    return order.modifications.some(m => !m.isSettled);
}

/**
 * Determines if the add manual payment button should be displayed
 */
export function shouldShowAddManualPaymentButton(order: OrderDetailFragment): boolean {
    if (!order) return false;

    return (
        order.type !== 'Aggregate' &&
        (order.state === 'ArrangingPayment' || order.state === 'ArrangingAdditionalPayment') &&
        (hasUnsettledModifications(order) || calculateOutstandingPaymentAmount(order) > 0)
    );
}
