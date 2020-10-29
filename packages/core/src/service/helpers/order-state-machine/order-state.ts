import { RequestContext } from '../../../api/common/request-context';
import { Transitions } from '../../../common/finite-state-machine/types';
import { Order } from '../../../entity/order/order.entity';

/**
 * @description
 * These are the default states of the Order process. They can be augmented and
 * modified by using the {@link OrderOptions} `process` property.
 *
 * @docsCategory orders
 */
export type OrderState =
    | 'Created'
    | 'AddingItems'
    | 'ArrangingPayment'
    | 'PaymentAuthorized'
    | 'PaymentSettled'
    | 'PartiallyShipped'
    | 'Shipped'
    | 'PartiallyDelivered'
    | 'Delivered'
    | 'Cancelled';

export const orderStateTransitions: Transitions<OrderState> = {
    Created: {
        to: ['AddingItems'],
    },
    AddingItems: {
        to: ['ArrangingPayment', 'Cancelled'],
    },
    ArrangingPayment: {
        to: ['PaymentAuthorized', 'PaymentSettled', 'AddingItems', 'Cancelled'],
    },
    PaymentAuthorized: {
        to: ['PaymentSettled', 'Cancelled'],
    },
    PaymentSettled: {
        to: ['PartiallyDelivered', 'Delivered', 'PartiallyShipped', 'Shipped', 'Cancelled'],
    },
    PartiallyShipped: {
        to: ['Shipped', 'PartiallyDelivered', 'Cancelled'],
    },
    Shipped: {
        to: ['PartiallyDelivered', 'Delivered', 'Cancelled'],
    },
    PartiallyDelivered: {
        to: ['Delivered', 'Cancelled'],
    },
    Delivered: {
        to: ['Cancelled'],
    },
    Cancelled: {
        to: [],
    },
};

export interface OrderTransitionData {
    ctx: RequestContext;
    order: Order;
}
