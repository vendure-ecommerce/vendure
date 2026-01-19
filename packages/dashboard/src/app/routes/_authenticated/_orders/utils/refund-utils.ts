import { RefundablePayment } from './get-refundable-payments.js';
import { Order } from './order-types.js';

export type LineSelection = { quantity: number; cancel: boolean };

/**
 * Calculate total refund amount from line selections and shipping
 */
export function calculateRefundTotal(
    lines: Order['lines'],
    lineSelections: Record<string, LineSelection>,
    shippingLines: Order['shippingLines'],
    refundShippingLineIds: string[],
): number {
    const itemTotal = lines.reduce((total, line) => {
        const selection = lineSelections[line.id];
        const refundCount = selection?.quantity || 0;
        return total + line.proratedUnitPriceWithTax * refundCount;
    }, 0);

    const shippingTotal = shippingLines.reduce((total, line) => {
        if (refundShippingLineIds.includes(line.id)) {
            return total + line.discountedPriceWithTax;
        }
        return total;
    }, 0);

    return itemTotal + shippingTotal;
}

/**
 * Allocate refund total across selected payments (immutable)
 */
export function allocateRefundsToPayments(payments: RefundablePayment[], total: number): RefundablePayment[] {
    let refundsAllocated = 0;
    return payments.map(payment => {
        if (!payment.selected) {
            return { ...payment, amountToRefund: 0 };
        }
        const amountToRefund = Math.min(payment.refundableAmount, total - refundsAllocated);
        refundsAllocated += amountToRefund;
        return { ...payment, amountToRefund };
    });
}

/**
 * Convert line selections to GraphQL input format
 */
export function getOrderLineInputFromSelections(
    lineSelections: Record<string, LineSelection>,
    filterFn: (line: LineSelection) => boolean = () => true,
): Array<{ orderLineId: string; quantity: number }> {
    return Object.entries(lineSelections)
        .filter(([, line]) => line.quantity > 0 && filterFn(line))
        .map(([orderLineId, line]) => ({ orderLineId, quantity: line.quantity }));
}
