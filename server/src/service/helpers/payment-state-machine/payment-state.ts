import { Payment } from 'entity/payment/payment.entity';

import { Transitions } from '../../../common/finite-state-machine';
import { Order } from '../../../entity/order/order.entity';

/**
 * These are the default states of the Order process. They can be augmented via
 * the orderProcessOptions property in VendureConfig.
 */
export type PaymentState = 'Authorized' | 'Settled' | 'Declined' | 'Refunded' | 'Cancelled';

export const paymentStateTransitions: Transitions<PaymentState> = {
    Authorized: {
        to: ['Settled', 'Cancelled'],
    },
    Settled: {
        to: ['Refunded'],
    },
    Declined: {
        to: [],
    },
    Refunded: {
        to: [],
    },
    Cancelled: {
        to: [],
    },
};

export interface PaymentTransitionData {
    payment: Payment;
    order: Order;
}
