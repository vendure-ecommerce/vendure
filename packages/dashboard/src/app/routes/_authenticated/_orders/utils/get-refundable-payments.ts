import { Payment } from './order-types.js';

export type RefundablePayment = Payment & {
    refundableAmount: number;
    amountToRefund: number;
    selected: boolean;
};

/**
 * Filters payments to only those that are settled and calculates the refundable amount
 * (payment amount minus sum of non-failed refunds).
 */
export function getRefundablePayments(payments: Payment[] | undefined | null): RefundablePayment[] {
    const settledPayments = (payments ?? []).filter(p => p.state === 'Settled');
    return settledPayments.map((payment, index) => {
        const successfulRefunds = payment.refunds.filter(r => r.state !== 'Failed');
        const refundedTotal = successfulRefunds.reduce((sum, refund) => sum + (refund.total || 0), 0);
        const refundableAmount = payment.amount - refundedTotal;
        return {
            ...payment,
            refundableAmount,
            amountToRefund: 0,
            selected: index === 0,
        };
    });
}

/**
 * Calculates the total refundable amount across all payments.
 */
export function getTotalRefundableAmount(refundablePayments: RefundablePayment[]): number {
    return refundablePayments.reduce((sum, p) => sum + p.refundableAmount, 0);
}

/**
 * Calculates the total amount currently allocated to refund across all payments.
 */
export function getTotalAmountToRefund(refundablePayments: RefundablePayment[]): number {
    return refundablePayments.reduce((sum, p) => sum + p.amountToRefund, 0);
}
