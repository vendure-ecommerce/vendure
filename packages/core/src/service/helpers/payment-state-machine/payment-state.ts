import { RequestContext } from '../../../api/common/request-context';
import { Transitions } from '../../../common/finite-state-machine';
import { Order } from '../../../entity/order/order.entity';
import { Payment } from '../../../entity/payment/payment.entity';

/**
 * @description
 * These are the default states of the payment process.
 *
 * @docsCategory payment
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

/**
 * @description
 * The data which is passed to the `onStateTransitionStart` function configured when constructing
 * a new `PaymentMethodHandler`
 *
 * @docsCategory payment
 */
export interface PaymentTransitionData {
    ctx: RequestContext;
    payment: Payment;
    order: Order;
}
