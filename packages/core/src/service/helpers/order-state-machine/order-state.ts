import { RequestContext } from '../../../api/common/request-context';
import { Transitions } from '../../../common/finite-state-machine/types';
import { Order } from '../../../entity/order/order.entity';

/**
 * @description
 * An interface to extend standard {@link OrderState}.
 *
 * @docsCategory orders
 */
export interface CustomOrderStates {}

/**
 * @description
 * These are the default states of the Order process. They can be augmented and
 * modified by using the {@link OrderOptions} `process` property.
 *
 * @docsCategory orders
 */
export type OrderState =
    | 'Created'
    | 'Draft'
    | 'AddingItems'
    | 'ArrangingPayment'
    | 'PaymentAuthorized'
    | 'PaymentSettled'
    | 'Received'
    | 'Processing'
    | 'ReadyForPickup'
    | 'Completed'
    | 'Modifying'
    | 'Delivering'
    | 'Cancelled'
    | keyof CustomOrderStates;

export const orderStateTransitions: Transitions<OrderState> = {
    Created: {
        to: ['AddingItems', 'Draft'],
    },
    Draft: {
        to: ['Cancelled', 'ArrangingPayment'],
    },
    AddingItems: {
        to: ['ArrangingPayment', 'Cancelled'],
    },
    ArrangingPayment: {
        to: ['PaymentAuthorized', 'PaymentSettled', 'AddingItems', 'Cancelled'],
    },
    PaymentAuthorized: {
        to: ['PaymentSettled', 'Cancelled', 'Modifying', 'Received'],
    },
    PaymentSettled: {
        to: ['Cancelled', 'Modifying', 'Received', 'Completed'],
    },
    Received: {
        to: ['Processing', 'Cancelled'],
    },
    Processing: {
        to: ['ReadyForPickup', 'Cancelled'],
    },
    ReadyForPickup: {
        to: ['Delivering', 'Cancelled', 'Completed'],
    },
    Delivering: {
        to: ['Completed', 'Cancelled'],
    },

    Modifying: {
        to: ['PaymentAuthorized', 'PaymentSettled'],
    },
    Cancelled: {
        to: [],
    },
    Completed: {
        to: [],
    },
};

export interface OrderTransitionData {
    ctx: RequestContext;
    order: Order;
}
