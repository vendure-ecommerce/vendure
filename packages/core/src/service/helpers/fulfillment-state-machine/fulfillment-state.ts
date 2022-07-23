import { RequestContext } from '../../../api/common/request-context';
import { Transitions } from '../../../common/finite-state-machine/types';
import { Fulfillment } from '../../../entity/fulfillment/fulfillment.entity';
import { Order } from '../../../entity/order/order.entity';

/**
 * @description
 * An interface to extend standard {@link FulfillmentState}.
 * 
 * @docsCategory fulfillment
 */
export interface CustomFulfillmentStates {}

/**
 * @description
 * These are the default states of the fulfillment process.
 *
 * @docsCategory fulfillment
 */
export type FulfillmentState = 'Created' | 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled' | keyof CustomFulfillmentStates;

export const fulfillmentStateTransitions: Transitions<FulfillmentState> = {
    Created: {
        to: ['Pending'],
    },
    Pending: {
        to: ['Shipped', 'Delivered', 'Cancelled'],
    },
    Shipped: {
        to: ['Delivered', 'Cancelled'],
    },
    Delivered: {
        to: ['Cancelled'],
    },
    Cancelled: {
        to: [],
    },
};

/**
 * @description
 * The data which is passed to the state transition handlers of the FulfillmentStateMachine.
 *
 * @docsCategory fulfillment
 */
export interface FulfillmentTransitionData {
    ctx: RequestContext;
    orders: Order[];
    fulfillment: Fulfillment;
}
