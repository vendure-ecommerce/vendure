import { Transitions } from '../../../common/finite-state-machine';
import { Order } from '../../../entity/order/order.entity';

/**
 * These are the default states of the Order process. They can be augmented via
 * the orderProcessOptions property in VendureConfig.
 */
export type OrderState =
    | 'AddingItems'
    | 'ArrangingShipping'
    | 'ArrangingPayment'
    | 'OrderComplete'
    | 'Cancelled';

export const orderStateTransitions: Transitions<OrderState> = {
    AddingItems: {
        to: ['ArrangingShipping'],
    },
    ArrangingShipping: {
        to: ['ArrangingPayment', 'AddingItems'],
    },
    ArrangingPayment: {
        to: ['OrderComplete', 'AddingItems'],
    },
    OrderComplete: {
        to: ['Cancelled'],
    },
    Cancelled: {
        to: [],
    },
};

export interface OrderTransitionData {
    order: Order;
}
