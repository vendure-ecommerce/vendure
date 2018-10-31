import { Transitions } from '../../../common/finite-state-machine';
import { Order } from '../../../entity/order/order.entity';

/**
 * These are the default states of the Order process. They can be augmented via
 * the orderProcessOptions property in VendureConfig.
 */
export type OrderState = 'AddingItems' | 'ArrangingPayment' | 'OrderComplete' | 'Cancelled';

export const orderStateTransitions: Transitions<OrderState> = {
    AddingItems: {
        to: ['ArrangingPayment'],
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
